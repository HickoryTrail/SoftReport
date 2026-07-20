export function OverallEvaluation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="section overall-evaluation">
      <h3 className="section-title">整体点评</h3>
      <p className="evaluation-text">{text}</p>
    </div>
  );
}
