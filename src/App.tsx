import { useEffect, useState } from "react";
import { loadReportData } from "./report-data";
import { ReportHeader } from "./components/ReportHeader";
import { EssayReport } from "./components/EssayReport";
import type { ReportData } from "./types";
import "./App.css";

/**
 * Uses the browser's built-in IntersectionObserver so the report remains a
 * dependency-free static page after Vite bundles it. Revealed elements are
 * never observed again, avoiding work while the user continues to scroll.
 */
function useScrollReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".motion-reveal"),
    );
    const reveal = (element: HTMLElement) => element.classList.add("is-revealed");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled]);
}

function LoadingState() {
  return (
    <div className="empty-state loading-state" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="loading-mark" aria-hidden="true" />
        <div className="loading-line loading-line--title" aria-hidden="true" />
        <div className="loading-line loading-line--body" aria-hidden="true" />
        <span className="loading-text">正在加载报告数据…</span>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  useScrollReveal(!loading && Boolean(data));

  if (loading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>暂无报告数据</h2>
          <p>请通过 C# Playwright 注入报告 JSON 数据后刷新页面。</p>
          <code>page.AddInitScriptAsync("window.__INITIAL_DATA__ = ...")</code>
        </div>
      </div>
    );
  }

  const { meta, report } = data;

  return (
    <div className="report-container">
      <ReportHeader meta={meta} />

      <EssayReport
        type="aw"
        title="应用文批阅报告"
        overallEvaluation={report.aw.overallEvaluation}
        grammarCorrection={report.aw.grammarCorrection}
        sentenceImprovements={report.aw.sentenceImprovements}
        optimizedEssay={report.aw.optimizedEssay}
      />

      <EssayReport
        type="cw"
        title="读后续写批阅报告"
        overallEvaluation={report.cw.overallEvaluation}
        grammarCorrection={report.cw.grammarCorrection}
        sentenceImprovements={report.cw.sentenceImprovements}
        optimizedEssay={report.cw.optimizedEssay}
      />

      <footer className="report-footer motion-reveal" data-reveal="footer">
        <span>SoftReport &mdash; 英语作文批阅报告</span>
      </footer>
    </div>
  );
}

export default App;
