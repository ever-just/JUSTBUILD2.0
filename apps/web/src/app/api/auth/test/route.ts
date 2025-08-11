import { NextRequest, NextResponse } from "next/server";

/**
 * Test route to verify auth routing works
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ 
      message: "Auth test route works!",
      timestamp: new Date().toISOString(),
      url: request.url
    });
  } catch (error) {
    console.error("Error in auth test:", error);
    return NextResponse.json(
      { error: "Failed in auth test route" },
      { status: 500 },
    );
  }
}
