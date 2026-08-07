import "server-only";

import { getLunaOverviewSnapshot } from "@/bff/luna/luna.query";

export async function getHomeLunaSnapshot() {
  const snapshot = await getLunaOverviewSnapshot();
  const tasks = snapshot.metrics?.tasks_by_status ?? {};
  return {
    title: "Luna",
    status: snapshot.status,
    agents_total: snapshot.metrics?.agents_total ?? 0,
    running_tasks: tasks.running ?? 0,
    failed_tasks: tasks.failed ?? 0,
  };
}
