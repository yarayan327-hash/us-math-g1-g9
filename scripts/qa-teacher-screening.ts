import assert from 'node:assert/strict';
import { SCREENING_QUESTIONS, TEST_VERSION } from '../src/teacher-test/questionBank';
import { scoreScreening } from '../src/teacher-test/scoring';
import type { AnswerKey, CandidateAnswers } from '../src/teacher-test/types';

assert.equal(TEST_VERSION, 'Teacher Math Screening v1.0');
assert.equal(SCREENING_QUESTIONS.length, 20);
assert.equal(new Set(SCREENING_QUESTIONS.map((question) => question.id)).size, 20);
assert.deepEqual(SCREENING_QUESTIONS.map((question) => question.id), Array.from({ length: 20 }, (_, index) => `Q${String(index + 1).padStart(2, '0')}`));
assert.ok(SCREENING_QUESTIONS.every((question) => Object.keys(question.options).join('') === 'ABCD'));
assert.deepEqual(SCREENING_QUESTIONS.map((question) => question.correctAnswer).join(''), 'BBABBCBBCBBCBBBABBBB');
assert.deepEqual(SCREENING_QUESTIONS.filter((question) => question.teachingJudgment).map((question) => question.id), ['Q02', 'Q03', 'Q05', 'Q08', 'Q11', 'Q16']);
assert.equal(SCREENING_QUESTIONS.filter((question) => question.band === 'A').length, 6);
assert.equal(SCREENING_QUESTIONS.filter((question) => question.band === 'B').length, 7);
assert.equal(SCREENING_QUESTIONS.filter((question) => question.band === 'C').length, 7);
assert.equal(SCREENING_QUESTIONS.find((question) => question.id === 'Q19')?.options.B.EN, '$2.50');
assert.equal(SCREENING_QUESTIONS.find((question) => question.id === 'Q20')?.options.B.EN, '26 meters');

const correct = Object.fromEntries(SCREENING_QUESTIONS.map((question) => [question.id, question.correctAnswer])) as CandidateAnswers;
const allCorrect = scoreScreening(correct);
assert.deepEqual({ score: allCorrect.totalScore, result: allCorrect.overallResult, a: allCorrect.bandA, b: allCorrect.bandB, c: allCorrect.bandC, judgment: allCorrect.teachingJudgment, range: allCorrect.recommendedRange }, { score: 100, result: 'STRONG PASS', a: 6, b: 7, c: 7, judgment: 6, range: 'G1-G9' });

const wrongKey = (answer: AnswerKey): AnswerKey => answer === 'A' ? 'B' : 'A';
const withWrong = (...ids: string[]) => ({ ...correct, ...Object.fromEntries(ids.map((id) => [id, wrongKey(correct[id])])) });
assert.equal(scoreScreening(withWrong('Q01', 'Q02')).recommendedRange, 'NOT YET QUALIFIED');
assert.equal(scoreScreening(withWrong('Q07', 'Q08', 'Q09')).recommendedRange, 'G1-G3');
assert.equal(scoreScreening(withWrong('Q14', 'Q15', 'Q16')).recommendedRange, 'G1-G6');
assert.equal(scoreScreening(withWrong('Q01', 'Q07', 'Q14')).recommendedRange, 'G1-G9');
assert.equal(scoreScreening(withWrong('Q01', 'Q02', 'Q03')).overallResult, 'STRONG PASS');
assert.equal(scoreScreening(withWrong('Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06')).overallResult, 'PASS');
assert.equal(scoreScreening(withWrong('Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'Q07')).overallResult, 'CONDITIONAL');
assert.equal(scoreScreening(withWrong('Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'Q07', 'Q08', 'Q09')).overallResult, 'NOT PASS');

console.log('Teacher screening QA passed: 20 questions, answer key, bands, judgment, score thresholds, and qualification logic.');
