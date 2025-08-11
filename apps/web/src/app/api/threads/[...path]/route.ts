import { NextRequest, NextResponse } from "next/server";
import { getGitHubToken } from "@/lib/auth";
import { encryptSecretEdge } from "../../agent/[...path]/edge-crypto";
import {
  GITHUB_TOKEN_COOKIE,
  GITHUB_INSTALLATION_TOKEN_COOKIE,
  GITHUB_INSTALLATION_NAME,
  GITHUB_INSTALLATION_ID,
  GITHUB_INSTALLATION_ID_COOKIE,
} from "@open-swe/shared/constants";

// Proxy for /api/threads/* endpoints to Railway backend
const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL ?? "http://localhost:2024";

async function proxyToLangGraph(request: NextRequest) {
  try {
    // Extract path from URL, mapping /api/threads/* to threads/*
    const path = request.nextUrl.pathname.replace(/^\/api\/threads\//, "threads/");
    
    // Construct target URL
    const targetUrl = new URL(`${LANGGRAPH_API_URL}/${path}`);
    
    // Forward query parameters from the original request
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    // Get all headers from the original request
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip headers that might cause issues
      if (!key.toLowerCase().startsWith('host') && 
          !key.toLowerCase().startsWith('content-length')) {
        headers.set(key, value);
      }
    });

    // Add GitHub authentication headers
    await addGitHubAuthHeaders(request, headers);

    // Properly handle request body for Edge Runtime compatibility
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = JSON.stringify(await request.json());
      } else {
        body = await request.text();
      }
    }

    // Make the request to LangGraph
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    // Get response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("Content-Encoding"); // Prevent decoding errors

    // Return the response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error("Threads proxy error:", error);
    return NextResponse.json(
      { error: "Threads proxy request failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function addGitHubAuthHeaders(request: NextRequest, headers: Headers) {
  // Get GitHub token data from cookies
  const tokenData = getGitHubToken(request);
  if (!tokenData) {
    throw new Error("GitHub authentication required");
  }

  const encryptionKey = process.env.SECRETS_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("SECRETS_ENCRYPTION_KEY not configured");
  }

  // Get installation ID from cookies
  const installationId = request.cookies.get(GITHUB_INSTALLATION_ID_COOKIE)?.value;
  if (!installationId) {
    throw new Error("GitHub installation ID missing");
  }

  // For now, use a simple installation name (you may need to adjust this based on your setup)
  const installationName = "default"; // TODO: Get actual installation name

  try {
    // Encrypt tokens using Edge Runtime compatible crypto
    const encryptedAccessToken = await encryptSecretEdge(tokenData.access_token, encryptionKey);
    const encryptedInstallationToken = await encryptSecretEdge(tokenData.access_token, encryptionKey); // Using access token as installation token for now

    // Add required authentication headers
    headers.set(GITHUB_INSTALLATION_NAME, installationName);
    headers.set(GITHUB_INSTALLATION_ID, installationId);
    headers.set(GITHUB_INSTALLATION_TOKEN_COOKIE, encryptedInstallationToken);
    headers.set(GITHUB_TOKEN_COOKIE, encryptedAccessToken);

  } catch (error) {
    throw new Error(`Failed to encrypt tokens: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export const GET = proxyToLangGraph;
export const POST = proxyToLangGraph;
export const PUT = proxyToLangGraph;
export const DELETE = proxyToLangGraph;
export const PATCH = proxyToLangGraph;
