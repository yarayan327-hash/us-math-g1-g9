import { SCREENING_QUESTIONS } from './questionBank.ts';
import type { CandidateAnswers, ScreeningScore } from './types.ts';

export function scoreScreening(answers: CandidateAnswers): ScreeningScore {
  const questionResults = SCREENING_QUESTIONS.map((question) => ({
    questionId: question.id,
    selectedAnswer: answers[question.id],
    correctAnswer: question.correctAnswer,
    isCorrect: answers[question.id] === question.correctAnswer
  }));

  const correctInBand = (band: 'A' | 'B' | 'C') =>
    questionResults.filter((result) => {
      const question = SCREENING_QUESTIONS.find((item) => item.id === result.questionId);
      return question?.band === band && result.isCorrect;
    }).length;

  const totalCorrect = questionResults.filter((result) => result.isCorrect).length;
  const totalScore = totalCorrect * 5;
  const bandA = correctInBand('A');
  const bandB = correctInBand('B');
  const bandC = correctInBand('C');
  const teachingJudgment = questionResults.filter((result) => {
    const question = SCREENING_QUESTIONS.find((item) => item.id === result.questionId);
    return question?.teachingJudgment && result.isCorrect;
  }).length;

  const overallResult = totalScore >= 85
    ? 'STRONG PASS'
    : totalScore >= 70
      ? 'PASS'
      : totalScore >= 60
        ? 'CONDITIONAL'
        : 'NOT PASS';

  const recommendedRange = bandA < 5
    ? 'NOT YET QUALIFIED'
    : bandB < 5
      ? 'G1-G3'
      : bandC < 5
        ? 'G1-G6'
        : 'G1-G9';

  return {
    totalCorrect,
    totalScore,
    overallResult,
    bandA,
    bandB,
    bandC,
    teachingJudgment,
    recommendedRange,
    questionResults
  };
}
