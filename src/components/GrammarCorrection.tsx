type GrammarInput = string | { para1: string; para2: string };

function DiffBlock({ html }: { html: string }) {
  return (
    <div
      className="diff-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function GrammarCorrection({ grammar }: { grammar?: GrammarInput }) {
  if (!grammar) return null;

  return (
    <div className="section grammar-correction">
      <h3 className="section-title">语法改错</h3>
      {typeof grammar === "string" ? (
        <DiffBlock html={grammar} />
      ) : (
        <div className="diff-paragraphs">
          <div className="diff-para">
            <span className="diff-label">第一段</span>
            <DiffBlock html={grammar.para1} />
          </div>
          <div className="diff-para">
            <span className="diff-label">第二段</span>
            <DiffBlock html={grammar.para2} />
          </div>
        </div>
      )}
    </div>
  );
}
