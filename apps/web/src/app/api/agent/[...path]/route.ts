import { NextRequest, NextResponse } from "next/server";

// Simple proxy without Edge Runtime incompatible dependencies
const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL ?? "http://localhost:2024";

async function proxyToLangGraph(request: NextRequest) {
  try {
    // Extract path from URL, removing the /api/agent/ prefix
    const path = request.nextUrl.pathname.replace(/^\/api\/agent\//, "");
    
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

    // Make the request to LangGraph
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
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
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export const GET = proxyToLangGraph;
export const POST = proxyToLangGraph;
export const PUT = proxyToLangGraph;
export const DELETE = proxyToLangGraph;
export const PATCH = proxyToLangGraph;