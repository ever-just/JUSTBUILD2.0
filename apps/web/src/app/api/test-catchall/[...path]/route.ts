import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return NextResponse.json({
    message: "Catch-all route is working!",
    path: params.path,
    url: request.url,
    timestamp: new Date().toISOString()
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return NextResponse.json({
    message: "Catch-all POST route is working!",
    path: params.path,
    url: request.url,
    timestamp: new Date().toISOString()
  });
}
