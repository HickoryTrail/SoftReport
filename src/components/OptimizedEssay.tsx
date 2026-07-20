import type { OptimizedEssayAW, OptimizedEssayCW } from "../types";

interface OptimizedEssayProps {
  data?: OptimizedEssayAW | OptimizedEssayCW;
  type: "aw" | "cw";
}

export function OptimizedEssay({ data, type }: OptimizedEssayProps) {
  if (!data) return null;

  const isAW = type === "aw";
  const awData = data as OptimizedEssayAW;
  const cwData = data as OptimizedEssayCW;

  return (
    <div className="section optimized-essay">
      <h3 className="section-title">改后佳作</h3>
      <div className="optimized-body">
        <div className="optimized-paragraphs">
          {isAW ? (
            <p className="essay-paragraph">{awData.essay}</p>
          ) : (
            <>
              <div className="optimized-para">
                <span className="para-label">第一段</span>
                <p className="essay-paragraph">{cwData.para1}</p>
              </div>
              <div className="optimized-para">
                <span className="para-label">第二段</span>
                <p className="essay-paragraph">{cwData.para2}</p>
              </div>
            </>
          )}
        </div>
        {(isAW ? awData.explanation : cwData.explanation) && (
          <div className="revision-note">
            <span className="revision-note-label">修改说明</span>
            <p>{isAW ? awData.explanation : cwData.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
