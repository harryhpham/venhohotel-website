import "server-only";

import { NextResponse } from "next/server";

type Permission = "luna:read" | "luna:write" | "luna:tools:read" | "luna:tools:write" | "luna:tools:approve" | "luna:workflows:read" | "luna:workflows:write" | "luna:workflows:execute" | "luna:orchestrations:read" | "luna:orchestrations:write" | "luna:orchestrations:execute" | "luna:orchestrations:review";
type Role = "admin" | "operator" | "viewer";

const rolePermissions: Record<Role, Permission[]> = {
  admin: ["luna:read", "luna:write", "luna:tools:read", "luna:tools:write", "luna:tools:approve", "luna:workflows:read", "luna:workflows:write", "luna:workflows:execute", "luna:orchestrations:read", "luna:orchestrations:write", "luna:orchestrations:execute", "luna:orchestrations:review"],
  operator: ["luna:read", "luna:tools:read", "luna:tools:approve", "luna:workflows:read", "luna:workflows:execute", "luna:orchestrations:read", "luna:orchestrations:execute", "luna:orchestrations:review"],
  viewer: ["luna:read", "luna:tools:read", "luna:workflows:read", "luna:orchestrations:read"],
};

export function requireLunaPermission(method: string): NextResponse | null {
  const role = ((process.env.VENHO_OS_ROLE || "admin") as Role);
  const required: Permission = method === "GET" ? "luna:read" : "luna:write";
  if (rolePermissions[role]?.includes(required)) return null;
  return NextResponse.json({ error: "forbidden", required }, { status: 403 });
}

export function requireLunaOrchestrationPermission(method: string, action?: string): NextResponse | null {
  const role = ((process.env.VENHO_OS_ROLE || "admin") as Role);
  const required: Permission = action === "runs" || ["continue", "pause", "cancel"].includes(action || "") ? "luna:orchestrations:execute" : method === "GET" ? "luna:orchestrations:read" : "luna:orchestrations:write";
  if (rolePermissions[role]?.includes(required)) return null;
  return NextResponse.json({ error: "forbidden", required }, { status: 403 });
}

export function requireLunaWorkflowExecutePermission(): NextResponse | null {
  const role = ((process.env.VENHO_OS_ROLE || "admin") as Role);
  const required: Permission = "luna:workflows:execute";
  if (rolePermissions[role]?.includes(required)) return null;
  return NextResponse.json({ error: "forbidden", required }, { status: 403 });
}

export function requireLunaToolApprovalPermission(): NextResponse | null {
  const role = ((process.env.VENHO_OS_ROLE || "admin") as Role);
  const required: Permission = "luna:tools:approve";
  if (rolePermissions[role]?.includes(required)) return null;
  return NextResponse.json({ error: "forbidden", required }, { status: 403 });
}
