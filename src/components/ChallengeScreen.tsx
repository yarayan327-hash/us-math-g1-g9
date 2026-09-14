import React, { useState } from 'react';
import { Activity, CourseStage, Language } from '../types';
import { Sparkles, Eye, BrainCircuit, ArrowRight, HelpCircle, Layers } from 'lucide-react';

interface ChallengeScreenProps {
  stage: CourseStage;
  activity: Activity;
  language: Language;
  onExploreVisually: () => void;
  onOpenTeacherGuide: () => void;
  onOpenCourseMenu: () => void;
  onToggleLanguage: () => void;
}

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({
  stage,
  activity,
  language,
  onExploreVisually,
  onOpenTeacherGuide,
  onOpenCourseMenu,
  onToggleLanguage
}) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);

  const hasStrategyOptions = activity.strategyOptions && activity.strategyOptions.length > 0;

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#F6F6F6] select-none">
      {/* Top Navigation Header */}
      <header className="w-full h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCourseMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#333333] text-xs font-bold transition-all cursor-pointer"
          >
            <Layers size={15} />
            <span>{language === 'ZH' ? '课程目录' : 'Course Menu'}</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <span className="text-base sm:text-lg font-extrabold text-[#333333] tracking-tight">
              {language === 'ZH' ? stage.titleZH : stage.titleEN}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#26B7FF] font-bold border border-blue-100">
              {stage.approxGradeBand}
            </span>
          </div>
        </div>

        {/* Center Badge: Stage Challenge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>{language === 'ZH' ? '初见真实难题 · 探索挑战' : 'Real-World Challenge'}</span>
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTeacherGuide}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#26B7FF] text-xs font-bold transition-colors cursor-pointer border border-blue-200/50"
          >
            <HelpCircle size={15} />
            <span>{language === 'ZH' ? '教师指引' : 'Teacher Guide'}</span>
          </button>

          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#333333] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
          >
            {language === 'EN' ? 'EN | 中文' : '中文 | EN'}
          </button>
        </div>
      </header>

      {/* Main 16:9 Challenge Canvas */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-5 sm:p-6 flex flex-col justify-center overflow-y-auto">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Level Superpower Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#26B7FF]/10 text-[#26B7FF] flex items-center justify-center font-black text-sm">
                L{stage.levelNumber}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#888888] block">
                  {language === 'ZH' ? '本阶段视觉超能力' : 'Stage Superpower'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#333333]">
                  {language === 'ZH' ? stage.superpowerZH : stage.superpowerEN}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {language === 'ZH' ? '课前思考 · Try this first' : 'Try this first'}
              </span>
            </div>
          </div>

          {/* Problem Presentation - Big, clear, readable */}
          <div className="space-y-4 py-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#26B7FF] flex items-center gap-1.5">
              <BrainCircuit size={15} />
              <span>{language === 'ZH' ? '挑战题目' : 'The Challenge'}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#222222] leading-snug tracking-tight">
              {language === 'ZH' ? activity.questionZH : activity.questionEN}
            </h1>
          </div>

          {/* Optional Strategy Selection (e.g. for Level 9 Master Challenge) */}
          {hasStrategyOptions && (
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                {language === 'ZH' ? '选择建模策略：' : 'Choose a Strategy:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activity.strategyOptions!.map((opt) => {
                  const isSelected = selectedStrategyId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedStrategyId(opt.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer text-xs font-bold ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                            : 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-white border-gray-200 text-[#333333] hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold">{language === 'ZH' ? opt.labelZH : opt.labelEN}</span>
                      </div>
                      {isSelected && (
                        <p className="text-[11px] font-normal mt-1 opacity-90">
                          {language === 'ZH' ? opt.explanationZH : opt.explanationEN}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Footer - Quiet, clean, student-centered */}
      <footer className="w-full h-18 bg-white border-t border-gray-200 px-6 sm:px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 text-xs text-[#777777] font-semibold">
          <span>{language === 'ZH' ? '准备好后，点击右侧逐步推导' : 'When ready, begin step-by-step visual modeling'}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="explore-visually-btn"
            onClick={onExploreVisually}
            className="px-8 py-3.5 bg-[#333333] hover:bg-black text-white rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Eye size={18} className="text-[#26B7FF]" />
            <span>{language === 'ZH' ? '开启视觉建模' : 'Show me visually'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};
