import type { LunaAuditLog } from "@/bff/luna/luna.dto";

export default function LunaAuditPanel({ auditLogs }: { auditLogs: LunaAuditLog[] }) {
  if (auditLogs.length === 0) return <div className="rounded border bg-white p-5">No audit logs.</div>;
  return (
    <div className="overflow-auto rounded border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F7F4EF] text-xs uppercase text-[#6B6B6B]">
          <tr><th className="p-3">Time</th><th>Request ID</th><th>Entity</th><th>Action</th><th>Status</th><th>Metadata</th></tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-3">{log.created_at}</td>
              <td>{log.request_id}</td>
              <td>{log.entity_type}<br /><span className="text-xs text-[#6B6B6B]">{log.entity_id}</span></td>
              <td>{log.action}</td>
              <td>{log.status}</td>
              <td><pre className="max-w-md overflow-auto text-xs">{JSON.stringify(log.audit_metadata ?? log.metadata ?? {}, null, 2)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
