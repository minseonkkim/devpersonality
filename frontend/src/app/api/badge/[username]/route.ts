import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

  const res = await fetch(`${backendUrl}/badge/${username}.svg`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return new NextResponse("Not found", { status: 404 });
  }

  const svg = await res.text();
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
