import React, { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock, Languages } from 'lucide-react';
import { SCREENING_QUESTIONS, TEST_VERSION } from './questionBank';
import { AnswerKey, CandidateAnswers, CandidateInfo, TestLanguage } from './types';
import './teacher-test.css';

const copy = {
  EN: {
    title: 'Teacher Math Screening Test', questions: '20 Questions', duration: 'Recommended time: 30 minutes',
    intro: 'Complete the candidate information, then answer every question. You may move backward, forward, and change answers before submission.',
    name: 'Name', teacherId: 'Teacher ID', email: 'Email', role: 'Current Teaching Role', optional: 'Optional',
    start: 'Start Assessment', required: 'Please enter your name to begin.', previous: 'Previous', next: 'Next',
    submit: 'Submit Assessment', progress: 'answered', unanswered: 'Please answer the following questions before submitting:',
    submitError: 'Submission failed. Please try again.', submitting: 'Submitting...', submitted: 'Assessment Submitted',
    thankYou: (name: string) => `Thank you, ${name}.`, success: 'Your assessment has been submitted successfully.',
    question: 'Question', of: 'of', overview: 'Question overview', answered: 'Answered', current: 'Current'
  },
  ZH: {
    title: '教师数学能力筛选测试', questions: '20 道题', duration: '建议完成时间：30 分钟',
    intro: '请先填写基本信息，再完成全部题目。提交前可以前后切换题目并修改答案。',
    name: '姓名', teacherId: '教师编号', email: '电子邮箱', role: '当前教学岗位', optional: '选填',
    start: '开始测试', required: '请输入姓名后开始测试。', previous: '上一题', next: '下一题',
    submit: '提交测试', progress: '已作答', unanswered: '提交前请完成以下题目：',
    submitError: '提交失败，请重试。', submitting: '正在提交...', submitted: '提交成功',
    thankYou: (name: string) => `感谢您，${name}。`, success: '您的测试已经成功提交。',
    question: '第', of: '题，共', overview: '题目导航', answered: '已作答', current: '当前题目'
  }
};

const initialInfo: CandidateInfo = { name: '', teacherId: '', email: '', teachingRole: '' };

export function TeacherTestApp() {
  const [language, setLanguage] = useState<TestLanguage>('EN');
  const [info, setInfo] = useState<CandidateInfo>(initialInfo);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CandidateAnswers>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = copy[language];
  const current = SCREENING_QUESTIONS[currentIndex];
  const unanswered = useMemo(() => SCREENING_QUESTIONS.filter((question) => !answers[question.id]), [answers]);

  const updateInfo = (field: keyof CandidateInfo, value: string) => setInfo((previous) => ({ ...previous, [field]: value }));

  const start = (event: React.FormEvent) => {
    event.preventDefault();
    if (!info.name.trim()) {
      setError(t.required);
      return;
    }
    setError('');
    setStarted(true);
  };

  const submit = async () => {
    if (unanswered.length) {
      setError(`${t.unanswered} ${unanswered.map((question) => Number(question.id.slice(1))).join(', ')}`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/teacher-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testVersion: TEST_VERSION, candidate: info, answers })
      });
      if (!response.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError(t.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="screening-shell screening-success">
        <div className="success-mark"><Check size={34} /></div>
        <h1>{t.submitted}</h1>
        <p>{t.thankYou(info.name.trim())}</p>
        <p>{t.success}</p>
      </main>
    );
  }

  return (
    <div className="screening-page">
      <header className="screening-header">
        <div>
          <p className="screening-kicker">{TEST_VERSION}</p>
          <h1>{t.title}</h1>
        </div>
        <button className="language-switch" onClick={() => setLanguage(language === 'EN' ? 'ZH' : 'EN')}>
          <Languages size={17} /> {language === 'EN' ? '中文' : 'English'}
        </button>
      </header>

      {!started ? (
        <main className="screening-shell">
          <div className="test-facts">
            <span>{t.questions}</span><span><Clock size={16} /> {t.duration}</span>
          </div>
          <p className="screening-intro">{t.intro}</p>
          <form className="candidate-form" onSubmit={start} noValidate>
            <label><span>{t.name} *</span><input value={info.name} onChange={(e) => updateInfo('name', e.target.value)} autoComplete="name" /></label>
            <label><span>{t.teacherId} <small>{t.optional}</small></span><input value={info.teacherId} onChange={(e) => updateInfo('teacherId', e.target.value)} /></label>
            <label><span>{t.email} <small>{t.optional}</small></span><input type="email" value={info.email} onChange={(e) => updateInfo('email', e.target.value)} autoComplete="email" /></label>
            <label><span>{t.role} <small>{t.optional}</small></span><input value={info.teachingRole} onChange={(e) => updateInfo('teachingRole', e.target.value)} /></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="primary-action" type="submit">{t.start} <ChevronRight size={18} /></button>
          </form>
        </main>
      ) : (
        <main className="test-layout">
          <aside className="question-nav" aria-label={t.overview}>
            <div className="progress-copy"><strong>{Object.keys(answers).length}/20</strong> {t.progress}</div>
            <div className="progress-track"><span style={{ width: `${Object.keys(answers).length * 5}%` }} /></div>
            <div className="question-grid">
              {SCREENING_QUESTIONS.map((question, index) => (
                <button key={question.id} className={`${answers[question.id] ? 'is-answered' : ''} ${index === currentIndex ? 'is-current' : ''}`} onClick={() => { setCurrentIndex(index); setError(''); }} aria-label={`${t.question} ${index + 1}`}>
                  {index + 1}
                </button>
              ))}
            </div>
          </aside>

          <section className="question-panel">
            <div className="question-meta">{language === 'EN' ? `${t.question} ${currentIndex + 1} ${t.of} 20` : `${t.question} ${currentIndex + 1} ${t.of} 20`}</div>
            <h2>{current.prompt[language]}</h2>
            <div className="answer-options">
              {(Object.keys(current.options) as AnswerKey[]).map((key) => (
                <label key={key} className={answers[current.id] === key ? 'selected' : ''}>
                  <input type="radio" name={current.id} checked={answers[current.id] === key} onChange={() => { setAnswers((previous) => ({ ...previous, [current.id]: key })); setError(''); }} />
                  <span className="option-letter">{key}</span><span>{current.options[key][language]}</span>
                </label>
              ))}
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="question-actions">
              <button className="secondary-action" disabled={currentIndex === 0} onClick={() => { setCurrentIndex((index) => index - 1); setError(''); }}><ChevronLeft size={18} /> {t.previous}</button>
              {currentIndex < 19 ? (
                <button className="primary-action" onClick={() => { setCurrentIndex((index) => index + 1); setError(''); }}>{t.next} <ChevronRight size={18} /></button>
              ) : (
                <button className="primary-action" onClick={submit} disabled={submitting}>{submitting ? t.submitting : t.submit}</button>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
