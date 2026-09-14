import React, { useRef, useEffect, useState } from 'react';
import { Activity, CourseStage, Language, VisualStep } from '../types';
import { ModelStage } from './visuals/ModelStage';
import { ChallengeScreen } from './ChallengeScreen';
import { ChevronLeft, ChevronRight, HelpCircle, Layers, CheckCircle2, Sparkles, BookOpen, Lock } from 'lucide-react';

interface TeachingViewProps {
  stage: CourseStage;
  activityIndex: number;
  stepIndex: number;
  language: Language;
  onNextStep: () => void;
  onPrevStep: () => void;
  onOpenTeacherGuide: () => void;
  onOpenCourseMenu: () => void;
  onToggleLanguage: () => void;
  selectedUnits: number[];
  onUnitTap: (index: number) => void;
  interactionFeedback: { show: boolean; isCorrect: boolean; message: string };
  onInteractionAnswer: (optionId: string) => void;
}

export const TeachingView: React.FC<TeachingViewProps> = ({
  stage,
  activityIndex,
  stepIndex,
  language,
  onNextStep,
  onPrevStep,
  onOpenTeacherGuide,
  onOpenCourseMenu,
  onToggleLanguage,
  selectedUnits,
  onUnitTap,
  interactionFeedback,
  onInteractionAnswer
}) => {
  const currentActivity: Activity = stage.activities[activityIndex];
  const currentStep: VisualStep = currentActivity.steps[stepIndex];
  const isFinalStepOfActivity = stepIndex >= currentActivity.steps.length - 1;
  const isFinalActivityOfStage = activityIndex >= stage.activities.length - 1;

  // Challenge screen control: Page 1 (Full Problem Display) vs Page 2 (Visual Modeling Steps)
  // Each level and problem begins on Page 1 (Full Problem Display)
  const [challengeRevealed, setChallengeRevealed] = useState<boolean>(false);

  // When switching stage or resetting step to 0, start on Page 1
  useEffect(() => {
    if (stepIndex === 0) {
      setChallengeRevealed(false);
    }
  }, [stage.id, activityIndex, stepIndex]);

  const interaction = currentActivity.interaction;
  const isInteractionActive = interaction && interaction.triggerAtStep === currentStep.stepNumber;

  const activeStepRef = useRef<HTMLDivElement>(null);
  const stepListRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to keep the active step visible without moving the rest of the layout
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [stepIndex, activityIndex]);

  // Page 1: Full Problem Challenge Screen
  if (!challengeRevealed) {
    return (
      <ChallengeScreen
        stage={stage}
        activity={currentActivity}
        language={language}
        onExploreVisually={() => setChallengeRevealed(true)}
        onOpenTeacherGuide={onOpenTeacherGuide}
        onOpenCourseMenu={onOpenCourseMenu}
        onToggleLanguage={onToggleLanguage}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#F6F6F6] select-none">
      {/* Top Fixed Navigation Bar */}
      <header className="w-full h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 max-w-[45%]">
          <button
            onClick={onOpenCourseMenu}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#333333] text-xs font-bold transition-all cursor-pointer"
          >
            <Layers size={15} />
            <span className="hidden sm:inline">{language === 'ZH' ? '课程目录' : 'Course Menu'}</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-200 hidden md:block shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm sm:text-base lg:text-lg font-extrabold text-[#333333] tracking-tight truncate">
              {language === 'ZH' ? stage.titleZH : stage.titleEN}
            </span>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#26B7FF] font-bold border border-blue-100 shrink-0">
              {stage.approxGradeBand}
            </span>
          </div>
        </div>

        {/* Center Progress Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#666666] bg-gray-100 px-3 py-1 rounded-full">
            {language === 'ZH'
              ? `题目 ${activityIndex + 1} / ${stage.activities.length}`
              : `Problem ${activityIndex + 1} of ${stage.activities.length}`}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Option to re-open challenge screen at any time */}
          <button
            onClick={() => setChallengeRevealed(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer border border-amber-200/80 shadow-xs"
            title={language === 'ZH' ? '切换至第一页：完整题目展示与课前读题思考' : 'Switch to Page 1: Full Problem & Discussion'}
          >
            <BookOpen size={14} />
            <span>{language === 'ZH' ? '第一页 · 完整题目' : 'Page 1 · Problem'}</span>
          </button>

          <button
            onClick={onOpenTeacherGuide}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#26B7FF] text-xs font-bold transition-colors cursor-pointer border border-blue-200/50"
          >
            <HelpCircle size={15} />
            <span>{language === 'ZH' ? '教师指引' : 'Teacher Guide'}</span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#333333] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
          >
            {language === 'EN' ? 'EN | 中文' : '中文 | EN'}
          </button>
        </div>
      </header>

      {/* Main 16:9 Teaching Stage Canvas */}
      <main className="flex-1 w-full p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden min-h-0">
        {/* Left Instruction Panel: ~33% (4 cols in 12-col grid) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-gray-200/70 flex flex-col justify-between overflow-hidden h-full">
          {/* 1. STICKY TOP QUESTION AREA - Never scrolls away */}
          <div className="shrink-0 pb-3 border-b border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#666666] font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                Step {stepIndex + 1} of {currentActivity.steps.length}
              </span>
            </div>

            {/* Permanent Visible Question */}
            <h2 className="text-base sm:text-lg font-extrabold text-[#333333] leading-snug tracking-tight pt-1">
              {language === 'ZH' ? currentActivity.questionZH : currentActivity.questionEN}
            </h2>
          </div>

          {/* 2. INDEPENDENT SCROLLING STEP LIST - Only this section scrolls */}
          <div
            ref={stepListRef}
            className="flex-1 min-h-0 overflow-y-auto pr-1 py-3 space-y-2.5"
          >
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1">
              <span>{language === 'ZH' ? '解题推导步骤' : 'Explanation Steps'}</span>
              <span>
                {stepIndex + 1}/{currentActivity.steps.length}
              </span>
            </div>

            {/* All Steps with State-Based Prominence */}
            {currentActivity.steps.map((step, idx) => {
              const isCompleted = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <div
                  key={`step-card-${idx}`}
                  ref={isCurrent ? activeStepRef : null}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#26B7FF]/10 border-2 border-[#26B7FF] text-[#333333] font-semibold shadow-xs ring-1 ring-[#26B7FF]/20'
                      : isCompleted
                        ? 'bg-[#F6F6F6] text-[#666666] border border-gray-200/60 opacity-80'
                        : 'bg-gray-50/40 border border-dashed border-gray-200 text-gray-400 opacity-40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-[#26B7FF] text-white shadow-xs'
                          : isCompleted
                            ? 'bg-gray-400 text-white'
                            : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {isCurrent ? (
                      <p className="leading-relaxed flex-1 font-semibold text-[#333333]">
                        {language === 'ZH' ? step.instructionZH : step.instructionEN}
                      </p>
                    ) : isCompleted ? (
                      <p className="leading-relaxed flex-1 text-[#666666]">
                        {language === 'ZH' ? step.instructionZH : step.instructionEN}
                      </p>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400 py-0.5 select-none">
                        <Lock size={12} className="shrink-0 text-gray-400" />
                        <span className="text-xs font-medium tracking-wide">
                          {language === 'ZH' ? `第 ${idx + 1} 步 · 点击下方“显示下一步”解锁` : `Step ${idx + 1} · Locked (Advance to reveal)`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Student Interaction Card */}
            {isInteractionActive && interaction && (
              <div className="p-3.5 bg-amber-50 border-2 border-[#FDE700] rounded-2xl space-y-2.5 animate-in fade-in mt-2">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>{language === 'ZH' ? '互动提问' : 'Student Check'}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#333333]">
                  {language === 'ZH' ? interaction.promptZH : interaction.promptEN}
                </p>

                {interaction.type === 'quick_choice' && interaction.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {interaction.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => onInteractionAnswer(opt.id)}
                        className="p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-amber-100/60 text-left font-bold text-xs sm:text-sm text-[#333333] transition-all cursor-pointer"
                      >
                        {language === 'ZH' ? opt.labelZH : opt.labelEN}
                      </button>
                    ))}
                  </div>
                )}

                {interactionFeedback.show && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      interactionFeedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>{interactionFeedback.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. STICKY BOTTOM PANEL META */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#777777] shrink-0">
            <span className="truncate max-w-full font-medium">
              {language === 'ZH' ? currentActivity.titleZH : currentActivity.titleEN}
            </span>
          </div>
        </div>

        {/* Right Visual Stage: ~67% (8 cols in 12-col grid) - FIXED COORDINATES */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-200/70 p-3 sm:p-4 flex flex-col justify-between overflow-hidden min-h-0 relative">
          <ModelStage
            activity={currentActivity}
            currentStep={currentStep}
            language={language}
            selectedUnits={selectedUnits}
            onUnitTap={onUnitTap}
            isInteractiveTapActive={isInteractionActive && interaction?.type === 'tap_relationship'}
          />
        </div>
      </main>

      {/* Fixed Bottom Teacher Controls Bar */}
      <footer className="w-full h-18 bg-white border-t border-gray-200 px-6 sm:px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (stepIndex === 0) {
                setChallengeRevealed(false);
              } else {
                onPrevStep();
              }
            }}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all bg-gray-100 hover:bg-gray-200 text-[#333333] cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>
              {stepIndex === 0
                ? language === 'ZH'
                  ? '第一页 (原题)'
                  : 'Page 1 (Problem)'
                : language === 'ZH'
                  ? '后退'
                  : 'Back'}
            </span>
          </button>
        </div>

        {/* Fixed Teacher Primary Action Button */}
        <div className="flex items-center gap-4">
          <button
            id="teacher-primary-action-btn"
            onClick={onNextStep}
            className="px-8 py-3 bg-[#333333] hover:bg-black text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>
              {isFinalStepOfActivity
                ? isFinalActivityOfStage
                  ? language === 'ZH'
                    ? '完成阶段并总结'
                    : 'Complete Stage & Review'
                  : language === 'ZH'
                    ? '下一题'
                    : 'Next Question'
                : language === 'ZH'
                  ? '显示下一步'
                  : 'Show Next Step'}
            </span>
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};
