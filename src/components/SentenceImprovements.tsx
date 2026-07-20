import type { SentenceImprovement } from "../types";

export function SentenceImprovements({
  items,
}: {
  items?: SentenceImprovement[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="section sentence-improvements">
      <h3 className="section-title">语句提升</h3>
      <ol className="improvement-list">
        {items.map((item, i) => (
          <li key={i} className="improvement-item">
            <div className="improvement-row">
              <span className="improvement-label">原句</span>
              <del className="improvement-original">{item.original}</del>
            </div>
            <div className="improvement-row">
              <span className="improvement-label">改后</span>
              <ins className="improvement-optimized">{item.optimized}</ins>
            </div>
            <div className="improvement-row">
              <span className="improvement-label">说明</span>
              <span className="improvement-reason">{item.reason}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
