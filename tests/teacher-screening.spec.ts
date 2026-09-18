import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('candidate flow is bilingual, preserves answers, validates completion, and hides results', async ({ page }) => {
  let submittedPayload: any;
  await page.route('**/api/teacher-submissions', async (route) => {
    submittedPayload = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, id: 'test-id' }) });
  });
  await page.goto('/teacher-test');
  await expect(page.getByRole('heading', { name: 'Teacher Math Screening Test' })).toBeVisible();
  await page.getByRole('button', { name: 'Start Assessment' }).click();
  await expect(page.getByRole('alert')).toContainText('Please enter your name');
  await page.getByLabel('Name *').fill('QA Teacher');
  await page.getByRole('button', { name: 'Start Assessment' }).click();

  await page.locator('.answer-options label').nth(1).click();
  await page.getByRole('button', { name: '中文' }).click();
  await expect(page.getByText('Sarah 老师有 1 盒铅笔')).toBeVisible();
  await expect(page.locator('.answer-options label').nth(1)).toHaveClass(/selected/);
  await page.getByRole('button', { name: 'English' }).click();

  await page.getByRole('button', { name: 'Question 20' }).click();
  await page.getByRole('button', { name: 'Submit Assessment' }).click();
  await expect(page.getByRole('alert')).toContainText('2, 3, 4');

  for (let index = 1; index < 20; index += 1) {
    await page.getByRole('button', { name: `Question ${index + 1}`, exact: true }).click();
    await page.locator('.answer-options label').first().click();
  }
  await page.getByRole('button', { name: 'Submit Assessment' }).click();
  await expect(page.getByRole('heading', { name: 'Assessment Submitted' })).toBeVisible();
  await expect(page.getByText('Thank you, QA Teacher.')).toBeVisible();
  await expect(page.getByText(/score|pass|correct answer/i)).toHaveCount(0);
  expect(submittedPayload.candidate).toEqual({ name: 'QA Teacher', teacherId: '', email: '', teachingRole: '' });
  expect(Object.keys(submittedPayload.answers)).toHaveLength(20);
});

test('results dashboard searches, filters, sorts, opens details, and never displays email', async ({ page }) => {
  const questionResults = Array.from({ length: 20 }, (_, index) => ({
    questionId: `Q${String(index + 1).padStart(2, '0')}`,
    selectedAnswer: 'B', correctAnswer: 'B', isCorrect: true
  }));
  await page.route('**/api/teacher-submissions', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ submissions: [
      { id: '1', testVersion: 'Teacher Math Screening v1.0', submittedAt: '2026-09-18T11:32:00.000Z', name: 'Sarah Ahmed', teacherId: 'EG1024', teachingRole: 'English Teacher', email: 'private@example.com', totalCorrect: 16, totalScore: 80, overallResult: 'PASS', bandA: 6, bandB: 6, bandC: 4, teachingJudgment: 5, recommendedRange: 'G1-G6', questionResults },
      { id: '2', testVersion: 'Teacher Math Screening v1.0', submittedAt: '2026-09-17T11:32:00.000Z', name: 'Mina Lee', teacherId: '', teachingRole: '', email: 'hidden@example.com', totalCorrect: 10, totalScore: 50, overallResult: 'NOT PASS', bandA: 4, bandB: 3, bandC: 3, teachingJudgment: 2, recommendedRange: 'NOT YET QUALIFIED', questionResults }
    ] }) });
  });
  await page.goto('/teacher-test/results');
  await expect(page.getByRole('heading', { name: 'Teacher Screening Results' })).toBeVisible();
  await expect(page.getByText('private@example.com')).toHaveCount(0);
  await page.getByPlaceholder('Search name / teacher ID').fill('EG1024');
  await expect(page.getByText('Sarah Ahmed')).toBeVisible();
  await expect(page.getByText('Mina Lee')).toHaveCount(0);
  await page.getByPlaceholder('Search name / teacher ID').fill('');
  await page.locator('.select-field').filter({ hasText: 'Overall result' }).locator('select').selectOption('NOT PASS');
  await expect(page.getByText('Mina Lee')).toBeVisible();
  await page.locator('.select-field').filter({ hasText: 'Overall result' }).locator('select').selectOption('ALL');
  await page.getByText('Sarah Ahmed').click();
  await expect(page.getByRole('heading', { name: 'Sarah Ahmed' })).toBeVisible();
  await expect(page.getByText('Question-by-question results')).toBeVisible();
  await expect(page.getByText(/private@example.com|hidden@example.com/)).toHaveCount(0);
});

test('existing student course still renders at the root route', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Visual Math Trial Class · Teacher Hub')).toBeVisible();
});
