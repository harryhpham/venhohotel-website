"use client";

import { useEffect, useState } from "react";

import type { HermesNousRuntimeStatus } from "@/bff/hermes-nous/hermes-nous.dto";

async function loadStatus(): Promise<HermesNousRuntimeStatus> {
  const response = await fetch("/api/v1/hermes-nous/status");
  return response.json();
}

export default function HermesNousSection() {
  const [status, setStatus] = useState<HermesNousRuntimeStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      setStatus(await loadStatus());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    loadStatus()
      .then((data) => {
        if (mounted) setStatus(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Hermes Agent Nous</h1>
          <p className="text-sm text-[#6B6B6B]">Official Nous Research Hermes Agent runtime integration.</p>
        </div>
        <button onClick={() => void refresh()} className="rounded bg-[#1B2D4F] px-4 py-2 text-sm text-white">Refresh</button>
      </header>

      <div className="rounded border border-[#D9D9D9] bg-white p-5">
        {loading ? <p className="text-sm text-[#6B6B6B]">Checking Hermes Nous...</p> : null}
        {!loading && status ? (
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-1 text-xs font-semibold ${status.status === "ok" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {status.status.toUpperCase()}
              </span>
              <span>{status.message || "Official Hermes Nous CLI is reachable."}</span>
            </div>
            <dl className="grid gap-2 md:grid-cols-[140px_1fr]">
              <dt className="text-[#6B6B6B]">Command</dt>
              <dd className="font-mono">{status.command}</dd>
              <dt className="text-[#6B6B6B]">Home</dt>
              <dd className="font-mono">{status.home}</dd>
              <dt className="text-[#6B6B6B]">Repo</dt>
              <dd className="font-mono">{status.repo}</dd>
              <dt className="text-[#6B6B6B]">Version</dt>
              <dd className="whitespace-pre-wrap font-mono">{status.version || "Unavailable"}</dd>
              <dt className="text-[#6B6B6B]">Doctor</dt>
              <dd className="whitespace-pre-wrap font-mono">{status.doctor || "Unavailable"}</dd>
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}
