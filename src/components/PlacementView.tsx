import React, { useState } from 'react';
import { CourseStage, Language, StageId } from '../types';
import { STAGES, STAGE_ORDER } from '../data/curriculum';
import { Sparkles, ArrowRight, BookOpen, Compass, ChevronDown } from 'lucide-react';

interface PlacementViewProps {
  recommendedStageId: StageId;
  reasonEN: string;
  reasonZH: string;
  language: Language;
  onConfirmStage: (stageId: StageId) => void;
  onToggleLanguage?: () => void;
}

export const PlacementView: React.FC<PlacementViewProps> = ({
  recommendedStageId,
  reasonEN,
  reasonZH,
  language,
  onConfirmStage,
  onToggleLanguage
}) => {
  const [selectedStageId, setSelectedStageId] = useState<StageId>(recommendedStageId);
  const [showOverride, setShowOverride] = useState(false);

  const stage: CourseStage = STAGES[selectedStageId];

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#F6F6F6] select-none">
      {/* Top Header Bar - 16:9 Consistent */}
      <header className="w-full h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26B7FF]/15 text-[#26B7FF] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>{language === 'ZH' ? '智能学力定位' : 'Placement Assessment'}</span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#333333] tracking-tight">
            {language === 'ZH' ? '测试结果与推荐起点' : 'Assessment Result & Starting Point'}
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
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200/80 flex flex-col justify-between h-full">
          <div className="space-y-6 my-auto">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                {language === 'ZH' ? '为你定制的推荐教学阶段' : 'Recommended Lesson Stage'}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
                  {language === 'ZH' ? stage.titleZH : stage.titleEN}
                </h2>
                <span className="px-3.5 py-1 rounded-full bg-[#26B7FF] text-white text-xs font-bold">
                  {language === 'ZH' ? `美国数学年级对应：${stage.approxGradeBand}` : `US Math: ${stage.approxGradeBand}`}
                </span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
              {language === 'ZH' ? stage.conceptIntroZH : stage.conceptIntroEN}
            </p>

            <div className="p-4 rounded-2xl bg-[#F6F6F6] border border-gray-200 text-xs sm:text-sm text-[#333333] flex items-center gap-3">
              <Compass size={18} className="text-[#26B7FF] shrink-0" />
              <span className="font-medium">{language === 'ZH' ? reasonZH : reasonEN}</span>
            </div>
          </div>

          {/* Optional Stage Switcher */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowOverride(!showOverride)}
              className="text-xs font-bold text-[#666666] hover:text-[#333333] flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'ZH' ? '需要切换到其他阶段？' : 'Want to select a different stage?'}</span>
              <ChevronDown size={14} className={showOverride ? 'rotate-180 transition-transform' : ''} />
            </button>

            {showOverride && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3">
                {STAGE_ORDER.map((sId) => {
                  const s = STAGES[sId];
                  const isSelected = selectedStageId === sId;
                  return (
                    <button
                      key={sId}
                      onClick={() => setSelectedStageId(sId)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#26B7FF] bg-[#26B7FF]/10 text-[#26B7FF]'
                          : 'border-gray-200 hover:border-gray-300 text-[#666666]'
                      }`}
                    >
                      <span className="block truncate">{language === 'ZH' ? s.titleZH : s.titleEN}</span>
                      <span className="text-[10px] text-gray-400 block">{s.approxGradeBand}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Asset Area: 35% (4 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col items-center justify-center h-full relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#26B7FF]/10 border-2 border-[#26B7FF] flex items-center justify-center text-[#26B7FF] shadow-sm">
              <BookOpen size={36} />
            </div>
            <div className="space-y-1 max-w-[220px]">
              <span className="text-sm font-bold text-[#333333] block">
                {language === 'ZH' ? '从直观问题开始探究' : 'Start with Visual Inquiry'}
              </span>
              <p className="text-xs text-[#777777] leading-relaxed">
                {language === 'ZH'
                  ? '先预测、再通过方块可视化验证，最后总结解题模型。'
                  : 'Predict first, discover with blocks, then name the method.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="w-full h-18 bg-white border-t border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <span className="text-xs text-[#777777]">
          {language === 'ZH' ? '确认阶段后进入互动课件' : 'Confirm stage to enter interactive courseware'}
        </span>

        <button
          onClick={() => onConfirmStage(selectedStageId)}
          className="px-8 py-3.5 bg-[#333333] hover:bg-black text-white rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <span>{language === 'ZH' ? '进入互动课件学习' : 'Start Interactive Class'}</span>
          <ArrowRight size={18} />
        </button>
      </footer>
    </div>
  );
};
