import React, { useEffect } from 'react';
import { Language, StageId } from '../types';
import { getStage } from '../data/curriculum';
import { getStageReview } from '../data/reviews';
import { Award, CheckCircle2, ArrowRight, RotateCcw, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SummaryViewProps {
  stageId: StageId;
  language: Language;
  onRestart: () => void;
  onExploreOther: () => void;
  onToggleLanguage?: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  stageId,
  language,
  onRestart,
  onExploreOther,
  onToggleLanguage
}) => {
  const stage = getStage(stageId);
  const nextStage = stage.nextStageId ? getStage(stage.nextStageId) : null;
  const reviewData = getStageReview(stageId);

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#F6F6F6] select-none">
      {/* Top Header Bar */}
      <header className="w-full h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#26B7FF] text-xs font-bold uppercase tracking-wider border border-blue-100">
            <Award size={15} />
            <span>{language === 'ZH' ? '体验课学习能力定位报告' : 'Trial Class Skill Report'}</span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#333333] tracking-tight">
            {language === 'ZH' ? stage.titleZH : stage.titleEN}
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
      <main className="flex-1 w-full p-6 sm:p-8 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left / Center Content: 65% (8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200/80 flex flex-col justify-between h-full overflow-hidden">
          <div className="space-y-5 my-auto overflow-y-auto pr-1">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                {language === 'ZH' ? '已完成学习阶段' : 'Completed Learning Stage'}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
                  {language === 'ZH' ? stage.titleZH : stage.titleEN}
                </h2>
                <span className="px-3.5 py-1 rounded-full bg-[#26B7FF] text-white text-xs font-bold">
                  {language === 'ZH'
                    ? `大致对应美国数学：${reviewData.skillReport.gradeBand}`
                    : `US Math Content: ${reviewData.skillReport.gradeBand}`}
                </span>
              </div>
            </div>

            {/* Stage-Specific Skills */}
            <div className="p-5 bg-[#F6F6F6] rounded-2xl border border-gray-200/80 space-y-3">
              <span className="text-xs font-bold text-[#333333] uppercase tracking-wider block">
                {language === 'ZH' ? '你现在已经掌握的核心能力：' : 'You can now confidently:'}
              </span>
              <div className="space-y-2">
                {(language === 'ZH'
                  ? reviewData.skillReport.skillsZH
                  : reviewData.skillReport.skillsEN
                ).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-[#26B7FF] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-[#333333] leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Progression Step */}
            {nextStage && (
              <div className="p-4.5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-[#26B7FF]">
                  <Sparkles size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {language === 'ZH' ? '下一个进阶目标' : 'Next Progression Step'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#333333]">
                  {language === 'ZH' ? nextStage.titleZH : nextStage.titleEN}
                </h4>
                <p className="text-xs text-[#666666]">
                  {language === 'ZH'
                    ? '把相同的方块可视化思维，进一步迁移应用到更复杂的数量关系中。'
                    : 'Transfer the same visual bar thinking to higher-level relational problem solving.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#777777]">
            <span>{language === 'ZH' ? '可视化数学体验课 · 学习档案' : 'Visual Math Trial Class Profile'}</span>
            <span className="font-semibold text-[#333333]">{stage.titleEN}</span>
          </div>
        </div>

        {/* Right Trophy / Mastery Area: 35% (4 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col items-center justify-center h-full relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#FDE700]/30 border-2 border-[#FDE700] flex items-center justify-center text-[#333333] shadow-sm">
              <Award size={40} className="text-amber-500" />
            </div>

            <div className="space-y-1 max-w-[220px]">
              <span className="text-sm font-extrabold text-[#333333] block">
                {language === 'ZH' ? '已达成思维转化' : 'Visual Thinking Achieved'}
              </span>
              <p className="text-xs text-[#777777] leading-relaxed">
                {language === 'ZH'
                  ? '从盲目猜算到建立条形方块结构，学会用几何直观化解算术难点。'
                  : 'From trial-and-error to structural unit thinking.'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F6F6F6] border border-gray-200 text-xs text-[#666666] font-medium w-full">
              {language === 'ZH' ? '推荐保持每日可视化练习习惯' : 'Ready for the next math level'}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="w-full h-18 bg-white border-t border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 text-[#666666] text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw size={16} />
          <span>{language === 'ZH' ? '重新开始' : 'Start Over'}</span>
        </button>

        <button
          onClick={onExploreOther}
          className="px-8 py-3.5 bg-[#333333] hover:bg-black text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>{language === 'ZH' ? '浏览其他阶段' : 'Explore Other Stages'}</span>
          <ArrowRight size={18} />
        </button>
      </footer>
    </div>
  );
};
