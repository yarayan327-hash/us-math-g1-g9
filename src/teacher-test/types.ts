export type TestLanguage = 'EN' | 'ZH';
export type AnswerKey = 'A' | 'B' | 'C' | 'D';
export type Band = 'A' | 'B' | 'C';

export interface LocalizedText {
  EN: string;
  ZH: string;
}

export interface ScreeningQuestion {
  id: string;
  band: Band;
  targetGrade: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  teachingJudgment: boolean;
  correctAnswer: AnswerKey;
  prompt: LocalizedText;
  options: Record<AnswerKey, LocalizedText>;
}

export type CandidateAnswers = Record<string, AnswerKey>;

export interface CandidateInfo {
  name: string;
  teacherId: string;
  email: string;
  teachingRole: string;
}

export interface QuestionResult {
  questionId: string;
  selectedAnswer: AnswerKey;
  correctAnswer: AnswerKey;
  isCorrect: boolean;
}

export interface ScreeningScore {
  totalCorrect: number;
  totalScore: number;
  overallResult: 'STRONG PASS' | 'PASS' | 'CONDITIONAL' | 'NOT PASS';
  bandA: number;
  bandB: number;
  bandC: number;
  teachingJudgment: number;
  recommendedRange: 'NOT YET QUALIFIED' | 'G1-G3' | 'G1-G6' | 'G1-G9';
  questionResults: QuestionResult[];
}

export interface PublicSubmission extends ScreeningScore {
  id: string;
  testVersion: string;
  submittedAt: string;
  name: string;
  teacherId: string;
  teachingRole: string;
}
