import { NextRequest, NextResponse } from "next/server";

/**
 * Simple agent health check route
 */
export async function GET(request: NextRequest) {
  try {
    // For now, just return a simple health check
    // Later we can make this proxy to Railway
    return NextResponse.json({ 
      status: "ok",
      message: "Agent health check working!",
      timestamp: new Date().toISOString(),
      url: request.url
    });
  } catch (error) {
    console.error("Error in agent health check:", error);
    return NextResponse.json(
      { error: "Failed in agent health check" },
      { status: 500 },
    );
  }
}
