import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

  const res = await fetch(`${backendUrl}/api/analyze/result/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Result not found" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
