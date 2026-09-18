import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const TEST_VERSION = 'Teacher Math Screening v1.0';
const QUESTION_IDS = Array.from({ length: 20 }, (_, index) => `Q${String(index + 1).padStart(2, '0')}`);
const ANSWER_KEYS = Object.fromEntries(QUESTION_IDS.map((id, index) => [id, 'BBABBCBBCBBCBBBABBBB'[index]]));
const JUDGMENT_IDS = new Set(['Q02', 'Q03', 'Q05', 'Q08', 'Q11', 'Q16']);

function scoreScreening(answers) {
  const questionResults = QUESTION_IDS.map((questionId) => ({
    questionId,
    selectedAnswer: answers[questionId],
    correctAnswer: ANSWER_KEYS[questionId],
    isCorrect: answers[questionId] === ANSWER_KEYS[questionId]
  }));
  const countCorrect = (ids) => ids.filter((id) => answers[id] === ANSWER_KEYS[id]).length;
  const bandA = countCorrect(QUESTION_IDS.slice(0, 6));
  const bandB = countCorrect(QUESTION_IDS.slice(6, 13));
  const bandC = countCorrect(QUESTION_IDS.slice(13, 20));
  const teachingJudgment = countCorrect([...JUDGMENT_IDS]);
  const totalCorrect = bandA + bandB + bandC;
  const totalScore = totalCorrect * 5;
  const overallResult = totalScore >= 85 ? 'STRONG PASS'
    : totalScore >= 70 ? 'PASS'
      : totalScore >= 60 ? 'CONDITIONAL'
        : 'NOT PASS';
  const recommendedRange = bandA < 5 ? 'NOT YET QUALIFIED'
    : bandB < 5 ? 'G1-G3'
      : bandC < 5 ? 'G1-G6'
        : 'G1-G9';
  return { questionResults, totalCorrect, totalScore, overallResult, bandA, bandB, bandC, teachingJudgment, recommendedRange };
}

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return neon(process.env.DATABASE_URL);
}

async function ensureTable() {
  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS teacher_math_submissions (
    id TEXT PRIMARY KEY, test_version TEXT NOT NULL, submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL, teacher_id TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
    teaching_role TEXT NOT NULL DEFAULT '', answers JSONB NOT NULL, question_results JSONB NOT NULL,
    total_correct INTEGER NOT NULL, total_score INTEGER NOT NULL, overall_result TEXT NOT NULL,
    band_a INTEGER NOT NULL, band_b INTEGER NOT NULL, band_c INTEGER NOT NULL,
    teaching_judgment INTEGER NOT NULL, recommended_range TEXT NOT NULL
  )`;
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function validateAnswers(value) {
  if (!value || typeof value !== 'object') return null;
  const validKeys = ['A', 'B', 'C', 'D'];
  const answers = {};
  for (const questionId of QUESTION_IDS) {
    const answer = value[questionId];
    if (!validKeys.includes(answer)) return null;
    answers[questionId] = answer;
  }
  return Object.keys(value).length === QUESTION_IDS.length ? answers : null;
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  try {
    await ensureTable();
    const sql = getSql();
    if (request.method === 'POST') {
      const body = request.body;
      const name = cleanText(body?.candidate?.name, 120);
      const answers = validateAnswers(body?.answers);
      if (body?.testVersion !== TEST_VERSION || !name || !answers) {
        response.status(400).json({ error: 'A name and answers to all 20 questions are required.' });
        return;
      }
      const score = scoreScreening(answers);
      const id = randomUUID();
      await sql`INSERT INTO teacher_math_submissions (
        id, test_version, name, teacher_id, email, teaching_role, answers, question_results,
        total_correct, total_score, overall_result, band_a, band_b, band_c, teaching_judgment, recommended_range
      ) VALUES (
        ${id}, ${TEST_VERSION}, ${name}, ${cleanText(body.candidate?.teacherId, 80)},
        ${cleanText(body.candidate?.email, 180)}, ${cleanText(body.candidate?.teachingRole, 120)},
        ${JSON.stringify(answers)}::jsonb, ${JSON.stringify(score.questionResults)}::jsonb,
        ${score.totalCorrect}, ${score.totalScore}, ${score.overallResult}, ${score.bandA},
        ${score.bandB}, ${score.bandC}, ${score.teachingJudgment}, ${score.recommendedRange}
      )`;
      response.status(201).json({ success: true, id });
      return;
    }
    if (request.method === 'GET') {
      const rows = await sql`SELECT id, test_version, submitted_at, name, teacher_id, teaching_role,
        question_results, total_correct, total_score, overall_result, band_a, band_b, band_c,
        teaching_judgment, recommended_range FROM teacher_math_submissions ORDER BY submitted_at DESC`;
      response.status(200).json({ submissions: rows.map((row) => ({
        id: row.id, testVersion: row.test_version, submittedAt: row.submitted_at, name: row.name,
        teacherId: row.teacher_id, teachingRole: row.teaching_role, questionResults: row.question_results,
        totalCorrect: row.total_correct, totalScore: row.total_score, overallResult: row.overall_result,
        bandA: row.band_a, bandB: row.band_b, bandC: row.band_c,
        teachingJudgment: row.teaching_judgment, recommendedRange: row.recommended_range
      })) });
      return;
    }
    response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Submission storage is unavailable.' });
  }
}
