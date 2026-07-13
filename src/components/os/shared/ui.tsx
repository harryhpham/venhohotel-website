/**
 * Shared UI primitives for VenHo OS sections.
 * All section components import from here to avoid duplication.
 */

"use client";

import { useState } from "react";

export const inputCls =
  "w-full rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-3 py-2 text-sm text-[#242424] focus:border-[#2F6F91] focus:outline-none";

export const textareaCls = `${inputCls} resize-none`;

export function SectionHeader({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#242424]">{title}</h2>
      <p className="mt-1 text-sm text-[#6B6B6B]">{caption}</p>
    </div>
  );
}

export function Field({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#8C867C]">
        {label}
      </label>
      {children}
      {caption && <p className="text-xs text-[#8C867C]">{caption}</p>}
    </div>
  );
}

export function PrimaryBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl bg-[#2F6F91] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#265F7D] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-lg border border-[#E8E5DF] px-3 py-1.5 text-xs font-semibold text-[#4D4A45] transition hover:bg-[#F2F0EC]"
    >
      {copied ? "✓ Đã copy" : "Copy"}
    </button>
  );
}

export function TabBar<T extends string>({
  tabs,
  active,
  onSelect,
}: {
  tabs: readonly T[];
  active: T;
  onSelect: (t: T) => void;
}) {
  return (
    <div className="mb-6 flex gap-1 border-b border-[#E8E5DF]">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`-mb-px px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 ${
            active === t
              ? "border-[#2F6F91] text-[#2F6F91]"
              : "border-transparent text-[#6B6B6B] hover:text-[#242424]"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
