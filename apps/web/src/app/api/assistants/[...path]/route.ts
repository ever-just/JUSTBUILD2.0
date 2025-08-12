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

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL ?? "http://localhost:2024";

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
    // Get installation token from GitHub API
    const installationTokenResponse = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'JustBuild-App'
      }
    });

    let actualInstallationToken = tokenData.access_token; // fallback
    if (installationTokenResponse.ok) {
      const installationTokenData = await installationTokenResponse.json();
      actualInstallationToken = installationTokenData.token;
    } else {
      console.warn("Failed to get installation token, using access token as fallback");
    }

    // Encrypt tokens using Edge Runtime compatible crypto
    const encryptedAccessToken = await encryptSecretEdge(tokenData.access_token, encryptionKey);
    const encryptedInstallationToken = await encryptSecretEdge(actualInstallationToken, encryptionKey);

    // Add authentication headers
    headers.set("x-github-installation-name", installationName);
    headers.set("x-github-installation-id", installationId);
    headers.set("x-github-installation-token", encryptedInstallationToken);
    headers.set("x-github-token", encryptedAccessToken);
  } catch (error) {
    console.error("Error encrypting GitHub tokens:", error);
    throw new Error("Failed to encrypt GitHub tokens");
  }
}

async function proxyToLangGraph(request: NextRequest) {
  try {
    // CRITICAL FIX: Correct path mapping for assistants endpoints
    const path = request.nextUrl.pathname.replace(/^\/api\/assistants\//, "assistants/");
    const targetUrl = new URL(`${LANGGRAPH_API_URL}/${path}`);

    // Forward query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    // Set up headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (!key.toLowerCase().startsWith('host') &&
          !key.toLowerCase().startsWith('content-length')) {
        headers.set(key, value);
      }
    });

    // Add GitHub authentication headers
    await addGitHubAuthHeaders(request, headers);

    // CRITICAL FIX: Safely handle request body to prevent consumption errors
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        const contentType = request.headers.get('content-type') || '';
        // Clone the request first to avoid body consumption issues
        const requestClone = request.clone();
        if (contentType.includes('application/json')) {
          body = JSON.stringify(await requestClone.json());
        } else {
          body = await requestClone.text();
        }
      } catch (error) {
        // Fallback to empty body if reading fails
        body = JSON.stringify({});
      }
    }

    // Make the request to Railway
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    // Set up response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("Content-Encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal proxy error" 
      }), 
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}

export const GET = proxyToLangGraph;
export const POST = proxyToLangGraph;
export const PUT = proxyToLangGraph;
export const DELETE = proxyToLangGraph;
export const PATCH = proxyToLangGraph;
export const OPTIONS = proxyToLangGraph;

export const runtime = "edge";
