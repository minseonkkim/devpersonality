import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
  const res = await fetch(`${backendUrl}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
