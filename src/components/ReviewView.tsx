import React, { useState } from 'react';
import { Language, StageId } from '../types';
import { getStage } from '../data/curriculum';
import { getStageReview, StageReviewData } from '../data/reviews';
import { ReviewVisualRecap } from './visuals/ReviewVisualRecap';
import { CheckCircle2, ArrowRight, BrainCircuit, Sparkles, XCircle } from 'lucide-react';

interface ReviewViewProps {
  stageId: StageId;
  language: Language;
  onFinishReview: () => void;
  onToggleLanguage?: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  stageId,
  language,
  onFinishReview,
  onToggleLanguage
}) => {
  const stage = getStage(stageId);
  const reviewData: StageReviewData = getStageReview(stageId);

  const [retrievalAnswers, setRetrievalAnswers] = useState<Record<number, number>>({});

  const handleSelectRetrieval = (qId: number, optionIdx: number) => {
    setRetrievalAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const answeredCount = Object.keys(retrievalAnswers).length;
  const isAllAnswered = answeredCount >= reviewData.retrievalQuestions.length;

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#F6F6F6] select-none">
      {/* Top Header Bar - 16:9 Consistent System */}
      <header className="w-full h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#26B7FF] text-xs font-bold uppercase tracking-wider border border-blue-100">
            <BrainCircuit size={15} />
            <span>{language === 'ZH' ? '阶段课后复习' : 'Post-Class Concept Review'}</span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#333333] tracking-tight">
            {language === 'ZH' ? stage.titleZH : stage.titleEN}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-[#666666] font-bold">
            {stage.approxGradeBand}
          </span>
        </div>

        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#333333] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
          >
            {language === 'EN' ? 'EN | 中文' : '中文 | EN'}
          </button>
        )}
      </header>

      {/* Main 16:9 Grid */}
      <main className="flex-1 w-full p-5 sm:p-6 grid grid-cols-12 gap-5 min-h-0 overflow-hidden">
        {/* Left Content Area: Core Ideas + Interactive Recall (65% / 8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 flex flex-col justify-between h-full overflow-hidden">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Stage-Specific Core Ideas */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                {language === 'ZH' ? '本阶段核心思维模型' : 'Core Thinking Model'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(language === 'ZH' ? reviewData.coreIdeasZH : reviewData.coreIdeasEN).map(
                  (idea, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#F6F6F6] border border-gray-200/80 flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#26B7FF] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#333333] leading-snug">
                        {idea}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Interactive Retrieval Questions */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#26B7FF]" />
                  <span>{language === 'ZH' ? '互动回忆提问 (点击验证理解)' : 'Interactive Recall Check'}</span>
                </span>
                <span className="text-xs text-[#777777] font-semibold">
                  {answeredCount} / {reviewData.retrievalQuestions.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {reviewData.retrievalQuestions.map((q) => {
                  const selectedIdx = retrievalAnswers[q.id];
                  const hasAnswered = selectedIdx !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-[#F6F6F6] border border-gray-200/70 space-y-2"
                    >
                      <p className="text-xs sm:text-sm font-bold text-[#333333]">
                        {language === 'ZH' ? q.promptZH : q.promptEN}
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedIdx === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectRetrieval(q.id, optIdx)}
                              className={`p-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? opt.isCorrect
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                                    : 'border-rose-400 bg-rose-50 text-rose-800'
                                  : 'border-gray-200 bg-white hover:bg-gray-50 text-[#333333]'
                              }`}
                            >
                              <span>{language === 'ZH' ? opt.labelZH : opt.labelEN}</span>
                              {isSelected && (
                                opt.isCorrect ? (
                                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 ml-1" />
                                ) : (
                                  <XCircle size={15} className="text-rose-500 shrink-0 ml-1" />
                                )
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#777777]">
            <span>{language === 'ZH' ? '完成阶段回顾，查看最终能力定位' : 'Review completed, proceed to report'}</span>
            <span className="font-semibold text-[#333333]">{stage.titleEN}</span>
          </div>
        </div>

        {/* Right Stage-Specific Visual Model Recap: 35% / 4 cols */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col items-center justify-center h-full relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
          <ReviewVisualRecap stageId={stageId} language={language} />
        </div>
      </main>

      {/* Bottom Bar Action */}
      <footer className="w-full h-18 bg-white border-t border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <span className="text-xs text-[#777777]">
          {language === 'ZH' ? '点击下方按钮生成学习定位报告' : 'Click to generate your final skill report'}
        </span>

        <button
          onClick={onFinishReview}
          className="px-8 py-3.5 bg-[#333333] hover:bg-black text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>{language === 'ZH' ? '查看学习成果报告' : 'View Skill Report'}</span>
          <ArrowRight size={18} />
        </button>
      </footer>
    </div>
  );
};
