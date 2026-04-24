"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LogoIcon from "@/components/LogoIcon";

const STEPS = [
  { label: "GitHub 인증 중...",       percent: 10 },
  { label: "커밋 패턴 분석 중...",     percent: 35 },
  { label: "야간 활동 비율 계산 중...", percent: 65 },
  { label: "성향 도출 중...",          percent: 85 },
  { label: "완료",                    percent: 100 },
];

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const jobIdParam = searchParams.get("job_id");

  const [step, setStep] = useState(STEPS[0].label);
  const [percent, setPercent] = useState(0);
  const [failed, setFailed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jobIdRef = useRef<string | null>(jobIdParam);

  useEffect(() => {
    if (!code && !jobIdParam) {
      router.replace("/?error=missing_job");
      return;
    }

    async function startJob() {
      const res = await fetch("/api/analyze/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error("start failed");
      const { job_id } = await res.json();
      jobIdRef.current = job_id;
    }

    async function poll() {
      const jid = jobIdRef.current;
      if (!jid) return;
      try {
        const res = await fetch(`/api/analyze/status/${jid}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();

        if (data.progress) {
          setStep(data.progress.step);
          setPercent(data.progress.percent);
        }

        if (data.status === "completed" && data.result) {
          clearInterval(intervalRef.current!);
          const r = data.result;
          router.replace(`/result/${r.username}`);
        } else if (data.status === "failed") {
          clearInterval(intervalRef.current!);
          setFailed(true);
        }
      } catch {
        clearInterval(intervalRef.current!);
        setFailed(true);
      }
    }

    async function init() {
      try {
        if (code) await startJob();
        poll();
        intervalRef.current = setInterval(poll, 1000);
      } catch {
        setFailed(true);
      }
    }

    init();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [code, jobIdParam, router]);

  const blocks = Math.round((percent / 100) * 20);

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center gap-8 px-6"
      style={{ background: "#0d1117" }}
    >
      <LogoIcon />

      {failed ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "#f85149" }}>
            분석 중 오류가 발생했습니다.
          </p>
          <a
            href="/"
            className="px-5 py-3 text-xs"
            style={{
              background: "#161b22",
              color: "#8b949e",
              border: "1px solid #30363d",
              fontFamily: "var(--font-mono)",
              textDecoration: "none",
            }}
          >
            돌아가기
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          <p
            className="text-xs text-center"
            style={{ fontFamily: "var(--font-mono)", color: "#8b949e", minHeight: "1.5rem" }}
          >
            {step}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(20, 1fr)",
              gap: "3px",
              width: "100%",
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "12px",
                  background: i < blocks ? "#3fb950" : "#21262d",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>

          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}
          >
            {percent}%
          </p>
        </div>
      )}
    </div>
  );
}

function AnalyzeFallback() {
  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center gap-8 px-6"
      style={{ background: "#0d1117" }}
    >
      <LogoIcon />
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <p
          className="text-xs text-center"
          style={{ fontFamily: "var(--font-mono)", color: "#8b949e", minHeight: "1.5rem" }}
        >
          GitHub 인증 중...
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(20, 1fr)",
            gap: "3px",
            width: "100%",
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ height: "12px", background: "#21262d" }} />
          ))}
        </div>
        <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "#484f58" }}>
          0%
        </p>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<AnalyzeFallback />}>
      <AnalyzeContent />
    </Suspense>
  );
}
