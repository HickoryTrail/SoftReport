import type { ReportMeta } from "../types";

function MetaBadge({ label, text }: { label: string; text: string }) {
  return (
    <span className="meta-badge">
      <span className="badge-dot" />
      <span className="badge-label">{label}</span>
      {text}
    </span>
  );
}

export function ReportHeader({ meta }: { meta: ReportMeta }) {
  return (
    <header className="report-header">
      <h1 className="report-title">
        <span className="title-en">English Essay Grading Report</span>
        <span className="title-zh">英语作文批阅报告</span>
      </h1>
      <div className="meta-badges">
        <MetaBadge label="姓名" text={meta.studentName} />
        {meta.className && <MetaBadge label="班级" text={meta.className} />}
        <MetaBadge label="考号" text={meta.studentCode} />
        <MetaBadge label="日期" text={meta.examDate} />
        <MetaBadge label="考试" text={meta.examName} />
      </div>
    </header>
  );
}
