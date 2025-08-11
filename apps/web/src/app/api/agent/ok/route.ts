import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Simple test endpoint to verify routing is working
  return NextResponse.json({ 
    status: "ok", 
    message: "Direct route is working",
    timestamp: new Date().toISOString()
  });
}
