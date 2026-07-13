/**
 * @layer interface
 * @context dashboard-sections
 * @owns Reusable placeholder for sections not yet implemented
 * @invariant Display-only; no data fetching.
 */

export default function PlaceholderSection({
  title,
  description,
  tools,
  stage,
}: {
  title: string;
  description: string;
  tools?: string[];
  stage?: string;
}) {
  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#E8E5DF] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#242424]">{title}</h1>
            <p className="mt-2 text-sm text-[#6B6B6B]">{description}</p>
          </div>
          <span className="rounded-full bg-[#FFF6E4] px-3 py-1 text-xs font-bold text-[#8A621A]">
            {stage ?? "Stage B"}
          </span>
        </div>

        {tools && tools.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#8C867C]">
              Tools coming
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-4 py-2 text-sm font-semibold text-[#4D4A45]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 h-px bg-[#E8E5DF]" />
        <p className="mt-6 text-xs text-[#8C867C]">
          Section này đang được xây dựng. Quay lại{" "}
          <a href="/os" className="font-semibold text-[#2F6F91] hover:underline">
            Home Workspace
          </a>{" "}
          để tiếp tục làm việc.
        </p>
      </div>
    </div>
  );
}
