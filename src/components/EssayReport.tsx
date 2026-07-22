import type { SentenceImprovement, OptimizedEssayAW, OptimizedEssayCW } from "../types";
import { OverallEvaluation } from "./OverallEvaluation";
import { GrammarCorrection } from "./GrammarCorrection";
import { SentenceImprovements } from "./SentenceImprovements";
import { OptimizedEssay } from "./OptimizedEssay";

type GrammarInput = string | { para1: string; para2: string };
type EssayInput = OptimizedEssayAW | OptimizedEssayCW;

interface EssayReportProps {
  type: "aw" | "cw";
  title: string;
  overallEvaluation: string;
  grammarCorrection: GrammarInput;
  sentenceImprovements: SentenceImprovement[];
  optimizedEssay: EssayInput;
}

export function EssayReport({
  type,
  title,
  overallEvaluation,
  grammarCorrection,
  sentenceImprovements,
  optimizedEssay,
}: EssayReportProps) {
  return (
    <section className={`essay-report essay-report--${type}`}>
      <div className="essay-header motion-reveal" data-reveal="heading">
        <h2 className="essay-title">{title}</h2>
      </div>

      <OverallEvaluation text={overallEvaluation} />
      <GrammarCorrection grammar={grammarCorrection} />
      <SentenceImprovements items={sentenceImprovements} />
      <OptimizedEssay data={optimizedEssay} type={type} />
    </section>
  );
}
