import { useState, useEffect } from "react";
import { loadReportData } from "./report-data";
import { ReportHeader } from "./components/ReportHeader";
import { EssayReport } from "./components/EssayReport";
import type { ReportData } from "./types";
import "./App.css";

function App() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>加载中…</h2>
          <p>正在加载报告数据…</p>
        </div>
      </div>
    );
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

      <footer className="report-footer">
        <span>SoftReport &mdash; 英语作文批阅报告</span>
      </footer>
    </div>
  );
}

export default App;
