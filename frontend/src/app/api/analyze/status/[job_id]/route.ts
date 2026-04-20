import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const { job_id } = await params;
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

  const res = await fetch(`${backendUrl}/api/analyze/status/${job_id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Job not found" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
