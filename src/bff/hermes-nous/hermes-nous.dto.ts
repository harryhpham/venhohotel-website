export type HermesNousStatus = "ok" | "not_installed" | "error";

export interface HermesNousRuntimeStatus {
  status: HermesNousStatus;
  command: string;
  home: string;
  repo: string;
  version: string | null;
  doctor: string | null;
  message: string | null;
}
