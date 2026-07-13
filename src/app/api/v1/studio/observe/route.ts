/**
 * POST /api/v1/studio/observe
 * Streams venho vision observe output via SSE.
 * Local-only — not intended for Vercel deployment.
 *
 * Body: { mode: "a"|"b", project: string, subject?: string, inputDir: string, dnaVersion?: string, provider?: string }
 * Response: text/event-stream — lines: { line: string, err?: boolean } | { done: true, code: number }
 */

import { spawn } from "child_process";
import { NextRequest } from "next/server";
import { STUDIO_DIR, VENHO_PATH } from "@/lib/studio/paths";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.mode || !body?.inputDir) {
    return new Response(JSON.stringify({ error: "mode and inputDir required" }), { status: 400 });
  }

  const { mode, project = "venho_hotel", subject, inputDir, dnaVersion = "1.0", provider } = body as {
    mode: "a" | "b";
    project?: string;
    subject?: string;
    inputDir: string;
    dnaVersion?: string;
    provider?: string;
  };

  const args = ["vision", "observe", "--mode", mode, "--project", project, "--input", inputDir];
  if (subject) args.push("--subject", subject);
  if (mode === "b") args.push("--dna-version", dnaVersion);
  if (provider && provider !== "config") args.push("--provider", provider);

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // controller already closed
        }
      };

      const proc = spawn("venho", args, {
        cwd: STUDIO_DIR,
        env: { ...process.env, PATH: VENHO_PATH },
      });

      const timeout = setTimeout(() => {
        proc.kill("SIGTERM");
        send({ line: "Timeout 300s — process killed.", err: true });
        send({ done: true, code: -1 });
        controller.close();
      }, 300_000);

      proc.stdout.on("data", (chunk: Buffer) =>
        chunk
          .toString()
          .split("\n")
          .filter(Boolean)
          .forEach((line) => send({ line })),
      );

      proc.stderr.on("data", (chunk: Buffer) =>
        chunk
          .toString()
          .split("\n")
          .filter(Boolean)
          .forEach((line) => send({ line, err: true })),
      );

      proc.on("error", (err) => {
        clearTimeout(timeout);
        send({ line: `Process error: ${err.message}`, err: true });
        send({ done: true, code: -1 });
        controller.close();
      });

      proc.on("close", (code) => {
        clearTimeout(timeout);
        send({ done: true, code: code ?? -1 });
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
