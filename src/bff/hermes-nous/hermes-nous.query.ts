import "server-only";

import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import { promisify } from "node:util";

import type { HermesNousRuntimeStatus } from "@/bff/hermes-nous/hermes-nous.dto";

const execFileAsync = promisify(execFile);

function homeDir(): string {
  return process.env.HERMES_NOUS_HOME || `${process.env.HOME || ""}/.hermes`;
}

function repoDir(): string {
  return process.env.HERMES_NOUS_REPO || `${homeDir()}/hermes-agent`;
}

function command(): string {
  return process.env.HERMES_NOUS_COMMAND || "hermes";
}

async function runHermes(args: string[]): Promise<string> {
  const result = await execFileAsync(command(), args, { timeout: 15000, maxBuffer: 1024 * 256 });
  return `${result.stdout || ""}${result.stderr || ""}`.trim();
}

export async function getHermesNousRuntimeStatus(): Promise<HermesNousRuntimeStatus> {
  const home = homeDir();
  const repo = repoDir();
  const cli = command();

  try {
    await access(repo);
  } catch {
    return {
      status: "not_installed",
      command: cli,
      home,
      repo,
      version: null,
      doctor: null,
      message: "Official Nous Hermes Agent repo is not installed.",
    };
  }

  try {
    const [version, doctor] = await Promise.all([
      runHermes(["--version"]).catch(() => runHermes(["--help"])),
      runHermes(["doctor"]).catch((error: unknown) => error instanceof Error ? error.message : "hermes doctor failed"),
    ]);

    return {
      status: "ok",
      command: cli,
      home,
      repo,
      version,
      doctor,
      message: null,
    };
  } catch (error) {
    return {
      status: "error",
      command: cli,
      home,
      repo,
      version: null,
      doctor: null,
      message: error instanceof Error ? error.message : "Hermes Nous status check failed.",
    };
  }
}
