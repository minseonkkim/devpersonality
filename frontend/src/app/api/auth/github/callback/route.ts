import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/?error=oauth_denied", request.url));
  }

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
  const res = await fetch(`${backendUrl}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/?error=analysis_failed", request.url));
  }

  const data = await res.json();
  const params = new URLSearchParams({
    type: data.type,
    username: data.username,
    avatar_url: data.avatar_url,
    scores: JSON.stringify(data.scores),
    axes: JSON.stringify(data.axes ?? []),
  });

  return NextResponse.redirect(new URL(`/result?${params}`, request.url));
}
