"use client";

import { useEffect, useRef } from "react";

export type LogLine = { text: string; err?: boolean };

export default function LiveLog({ lines, running }: { lines: LogLine[]; running: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  if (lines.length === 0 && !running) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#E8E5DF] bg-[#1A1A1A]">
      <div className="flex items-center gap-2 border-b border-[#333] px-4 py-2">
        <span className={`h-2 w-2 rounded-full ${running ? "animate-pulse bg-[#5F8F6F]" : "bg-[#6B6B6B]"}`} />
        <span className="text-xs font-mono text-[#6B6B6B]">{running ? "Đang chạy…" : "Xong"}</span>
      </div>
      <div className="max-h-64 overflow-y-auto p-4">
        {lines.length === 0 ? (
          <span className="text-xs font-mono text-[#6B6B6B]">Đang khởi động…</span>
        ) : (
          lines.map((l, i) => (
            <div
              key={i}
              className={`font-mono text-xs leading-5 ${l.err ? "text-[#E07070]" : "text-[#A8D8A8]"}`}
            >
              {l.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
