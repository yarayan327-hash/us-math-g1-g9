import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, Search, X } from 'lucide-react';
import { SCREENING_QUESTIONS, TEST_VERSION } from './questionBank';
import { AnswerKey, PublicSubmission } from './types';
import './teacher-test.css';

type SortMode = 'newest' | 'oldest' | 'score-high' | 'score-low';

export function TeacherResultsApp() {
  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [rangeFilter, setRangeFilter] = useState('ALL');
  const [sort, setSort] = useState<SortMode>('newest');
  const [selected, setSelected] = useState<PublicSubmission | null>(null);

  useEffect(() => {
    fetch('/api/teacher-submissions')
      .then((response) => { if (!response.ok) throw new Error(); return response.json(); })
      .then((data) => setSubmissions(data.submissions))
      .catch(() => setError('Results could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return submissions
      .filter((submission) => !normalized || submission.name.toLowerCase().includes(normalized) || submission.teacherId.toLowerCase().includes(normalized))
      .filter((submission) => resultFilter === 'ALL' || submission.overallResult === resultFilter)
      .filter((submission) => rangeFilter === 'ALL' || submission.recommendedRange === rangeFilter)
      .sort((a, b) => {
        if (sort === 'oldest') return Date.parse(a.submittedAt) - Date.parse(b.submittedAt);
        if (sort === 'score-high') return b.totalScore - a.totalScore;
        if (sort === 'score-low') return a.totalScore - b.totalScore;
        return Date.parse(b.submittedAt) - Date.parse(a.submittedAt);
      });
  }, [submissions, search, resultFilter, rangeFilter, sort]);

  if (selected) return <ResultDetail submission={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="results-page">
      <header className="results-header">
        <div><p className="screening-kicker">{TEST_VERSION}</p><h1>Teacher Screening Results</h1><p>Internal review dashboard</p></div>
        <a href="/teacher-test">Open assessment</a>
      </header>
      <section className="results-controls">
        <label className="search-field"><Search size={17} /><input placeholder="Search name / teacher ID" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <Select value={resultFilter} onChange={setResultFilter} label="Overall result" options={['ALL', 'STRONG PASS', 'PASS', 'CONDITIONAL', 'NOT PASS']} />
        <Select value={rangeFilter} onChange={setRangeFilter} label="Teaching range" options={['ALL', 'NOT YET QUALIFIED', 'G1-G3', 'G1-G6', 'G1-G9']} />
        <Select value={sort} onChange={(value) => setSort(value as SortMode)} label="Sort" options={['newest', 'oldest', 'score-high', 'score-low']} labels={['Newest first', 'Oldest first', 'Highest score', 'Lowest score']} />
      </section>
      {loading ? <div className="results-state">Loading results...</div> : error ? <div className="results-state error">{error}</div> : (
        <div className="results-table-wrap">
          <table className="results-table">
            <thead><tr><th>Name</th><th>Teacher ID</th><th>Current Teaching Role</th><th>Submitted At</th><th>Total</th><th>Overall Result</th><th>Band A</th><th>Band B</th><th>Band C</th><th>Teaching Judgment</th><th>Recommended Range</th></tr></thead>
            <tbody>
              {filtered.map((submission) => (
                <tr key={submission.id} onClick={() => setSelected(submission)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') setSelected(submission); }}>
                  <td><strong>{submission.name}</strong></td><td>{submission.teacherId || '—'}</td><td>{submission.teachingRole || '—'}</td><td>{formatDate(submission.submittedAt)}</td><td>{submission.totalScore}/100</td><td><span className={`result-badge ${submission.overallResult.toLowerCase().replaceAll(' ', '-')}`}>{submission.overallResult}</span></td><td>{submission.bandA}/6</td><td>{submission.bandB}/7</td><td>{submission.bandC}/7</td><td>{submission.teachingJudgment}/6</td><td><strong>{submission.recommendedRange}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="results-state">No matching submissions.</div>}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, label, options, labels = options }: { value: string; onChange: (value: string) => void; label: string; options: string[]; labels?: string[] }) {
  return <label className="select-field"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option, index) => <option key={option} value={option}>{labels[index] ?? option}</option>)}</select><ChevronDown size={15} /></label>;
}

function ResultDetail({ submission, onBack }: { submission: PublicSubmission; onBack: () => void }) {
  return (
    <div className="results-page detail-page">
      <header className="detail-header"><button onClick={onBack}><ArrowLeft size={18} /> Back to results</button><span>{submission.testVersion}</span></header>
      <main className="detail-main">
        <section className="detail-summary">
          <div><p>Teacher</p><h1>{submission.name}</h1><span>{submission.teacherId || 'No teacher ID'} · {submission.teachingRole || 'No role provided'}</span><small>Submitted {formatDate(submission.submittedAt)}</small></div>
          <div className="score-block"><strong>{submission.totalScore}</strong><span>/100</span><b>{submission.overallResult}</b></div>
        </section>
        <section className="metric-row"><Metric label="Band A" value={`${submission.bandA}/6`} /><Metric label="Band B" value={`${submission.bandB}/7`} /><Metric label="Band C" value={`${submission.bandC}/7`} /><Metric label="Teaching Judgment" value={`${submission.teachingJudgment}/6`} /><Metric label="Recommended Range" value={submission.recommendedRange} /></section>
        <section className="answer-review"><h2>Question-by-question results</h2>{submission.questionResults.map((result, index) => { const question = SCREENING_QUESTIONS.find((item) => item.id === result.questionId)!; return <article key={result.questionId} className={result.isCorrect ? 'correct' : 'incorrect'}><div className="review-heading"><strong>{index + 1}. {question.prompt.EN}</strong><span>{result.isCorrect ? 'Correct' : 'Incorrect'}</span></div><div className="review-answers"><p><b>Teacher answer:</b> {formatAnswer(question.options, result.selectedAnswer)}</p><p><b>Correct answer:</b> {formatAnswer(question.options, result.correctAnswer)}</p></div></article>; })}</section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function formatAnswer(options: Record<AnswerKey, { EN: string }>, key: AnswerKey) { return `${key}. ${options[key].EN}`; }
function formatDate(value: string) { return new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
