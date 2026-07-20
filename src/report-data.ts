import type { ReportData } from "./types";

/**
 * 从 window.__INITIAL_DATA__ 加载报告数据。
 * C# Playwright 通过 AddInitScript 注入该变量。
 * 开发模式下从 sample-report.json 加载。
 */
export async function loadReportData(): Promise<ReportData | null> {
  // 1. Try window.__INITIAL_DATA__ (C# Playwright injection)
  const data = (window as unknown as { __INITIAL_DATA__?: ReportData })
    .__INITIAL_DATA__;
  if (data && typeof data === "object" && (data as any).schemaVersion === 1) {
    return data;
  }

  // 2. Dev mode: fetch sample-report.json from dev server
  try {
    const resp = await fetch("./sample-report.json");
    if (resp.ok) {
      const json = await resp.json();
      if (json && json.schemaVersion === 1) {
        return json as ReportData;
      }
    }
  } catch {
    // ignore — dev server may not be running
  }

  return null;
}
