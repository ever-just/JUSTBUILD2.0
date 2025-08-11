import { NextRequest, NextResponse } from "next/server";
import {
  GITHUB_TOKEN_COOKIE,
  GITHUB_INSTALLATION_ID_COOKIE,
  GITHUB_INSTALLATION_TOKEN_COOKIE,
  GITHUB_INSTALLATION_NAME,
  GITHUB_INSTALLATION_ID,
} from "@open-swe/shared/constants";
import {
  getGitHubInstallationTokenOrThrow,
  getInstallationNameFromReq,
  getGitHubAccessTokenOrThrow,
} from "./utils";
import { encryptSecret } from "@open-swe/shared/crypto";

// Manual proxy implementation to replace langgraph-nextjs-api-passthrough
const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL ?? "http://localhost:2024";

async function handler(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/agent\//, "");
    
    // Construct target URL
    const targetUrl = new URL(`${LANGGRAPH_API_URL}/${path}`);
    
    // Copy search params
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // Get authentication headers
    const encryptionKey = process.env.SECRETS_ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error("SECRETS_ENCRYPTION_KEY environment variable is required");
    }

    const installationIdCookie = request.cookies.get(GITHUB_INSTALLATION_ID_COOKIE)?.value;
    if (!installationIdCookie) {
      throw new Error("No GitHub installation ID found. GitHub App must be installed first.");
    }

    const [installationToken, installationName] = await Promise.all([
      getGitHubInstallationTokenOrThrow(installationIdCookie, encryptionKey),
      getInstallationNameFromReq(request.clone(), installationIdCookie),
    ]);

    // Prepare headers
    const headers = new Headers();
    
    // Copy original headers (excluding problematic ones)
    request.headers.forEach((value, key) => {
      if (!key.toLowerCase().startsWith('host') && 
          !key.toLowerCase().startsWith('connection') &&
          !key.toLowerCase().startsWith('content-length')) {
        headers.set(key, value);
      }
    });

    // Add authentication headers
    headers.set(GITHUB_TOKEN_COOKIE, getGitHubAccessTokenOrThrow(request, encryptionKey));
    headers.set(GITHUB_INSTALLATION_TOKEN_COOKIE, installationToken);
    headers.set(GITHUB_INSTALLATION_NAME, installationName);
    headers.set(GITHUB_INSTALLATION_ID, installationIdCookie);

    // Handle request body
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const clonedRequest = request.clone();
      body = await clonedRequest.text();
      
      // Handle encryption for configurable API keys
      if (body && headers.get('content-type')?.includes('application/json')) {
        try {
          const jsonBody = JSON.parse(body);
          if (jsonBody.config?.configurable && "apiKeys" in jsonBody.config.configurable) {
            const apiKeys = jsonBody.config.configurable.apiKeys;
            const encryptedApiKeys: Record<string, unknown> = {};

            for (const [key, value] of Object.entries(apiKeys)) {
              if (typeof value === "string" && value.trim() !== "") {
                encryptedApiKeys[key] = encryptSecret(value, encryptionKey);
              } else {
                encryptedApiKeys[key] = value;
              }
            }

            jsonBody.config.configurable.apiKeys = encryptedApiKeys;
            body = JSON.stringify(jsonBody);
            headers.set('content-length', Buffer.byteLength(body, 'utf8').toString());
          }
        } catch (e) {
          // If JSON parsing fails, use original body
        }
      }
    }

    // Make request to LangGraph server
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: body,
    });

    // Create response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Return response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Internal proxy error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

export const runtime = 'edge';