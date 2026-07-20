/* ============================================
   SoftReport — TypeScript 数据接口
   对齐 docs/export-report-schema.json v1
   ============================================ */

export interface ReportMeta {
  studentName: string;
  className?: string;
  studentCode: string;
  examDate: string;
  examName: string;
}

export interface SentenceImprovement {
  original: string;
  optimized: string;
  reason: string;
}

export interface OptimizedEssayAW {
  essay: string;
  explanation: string;
}

export interface OptimizedEssayCW {
  para1: string;
  para2: string;
  explanation: string;
}

export interface AWReport {
  overallEvaluation: string;
  grammarCorrection: string;
  sentenceImprovements: SentenceImprovement[];
  optimizedEssay: OptimizedEssayAW;
}

export interface CWReport {
  overallEvaluation: string;
  grammarCorrection: {
    para1: string;
    para2: string;
  };
  sentenceImprovements: SentenceImprovement[];
  optimizedEssay: OptimizedEssayCW;
}

export interface ReportData {
  schemaVersion: 1;
  meta: ReportMeta;
  report: {
    aw: AWReport;
    cw: CWReport;
  };
}
