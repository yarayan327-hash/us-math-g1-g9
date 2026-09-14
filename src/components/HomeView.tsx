import React from 'react';
import { Language, StageId } from '../types';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface HomeViewProps {
  language: Language;
  onStartDiagnostic: () => void;
  onOpenCourseMenu: () => void;
  onQuickStageStart?: (stageId: StageId) => void;
  onToggleLanguage?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onStartDiagnostic,
  onOpenCourseMenu,
  onToggleLanguage
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#F6F6F6] select-none">
      {/* Top Header Bar */}
      <header className="w-full h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F6F6F6] border border-gray-200">
            <div className="w-6 h-6 rounded-lg bg-[#26B7FF] flex items-center justify-center text-white font-bold text-xs">
              1
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#26B7FF] flex items-center justify-center text-white font-bold text-xs">
              1
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#FDE700] flex items-center justify-center text-[#333333] font-bold text-xs">
              +
            </div>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#333333] tracking-tight">
            {language === 'ZH' ? '可视化数学体验课 · 教师工作台' : 'Visual Math Trial Class · Teacher Hub'}
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

      {/* Main 16:9 Presentation Canvas - Two Clear Teacher Entry Paths */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 sm:p-10 flex flex-col justify-center min-h-0 overflow-y-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#26B7FF] text-xs font-bold uppercase tracking-wider border border-blue-100 mb-1">
            <Sparkles size={14} />
            <span>{language === 'ZH' ? '教学准备 · 选择进入方式' : 'Teacher Setup · Choose Starting Flow'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
            {language === 'ZH' ? '请选择今天的授课起点' : 'Choose Your Teaching Pathway'}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto">
            {language === 'ZH'
              ? '可先通过简短题目推荐适合阶段，或直接自选任意阶梯开启教学。'
              : 'Assess your student with a 5-question diagnostic, or jump directly to any level.'}
          </p>
        </div>

        {/* TWO CLEAR PATHS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto w-full">
          {/* OPTION A: Start with Diagnostic */}
          <button
            id="entry-option-diagnostic"
            onClick={onStartDiagnostic}
            className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 hover:border-[#26B7FF] hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#26B7FF] border border-blue-100">
                  {language === 'ZH' ? '路径 A · 推荐流程' : 'OPTION A · RECOMMENDED'}
                </span>
                <span className="text-xs font-bold text-gray-400">5 Questions</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#222222] group-hover:text-[#26B7FF] transition-colors">
                  {language === 'ZH' ? '先进行能力测试' : 'Start with Diagnostic'}
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  {language === 'ZH'
                    ? '通过5道简短题目判断学生适合从哪个阶段开始。'
                    : 'Use 5 short questions to recommend the best starting level.'}
                </p>
              </div>

              {/* Visual preview cue */}
              <div className="p-3 bg-[#F6F6F6] rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#26B7FF] text-white flex items-center justify-center font-black text-xs shrink-0">
                  Q1
                </div>
                <div className="text-xs text-[#555555]">
                  <p className="font-semibold">{language === 'ZH' ? '快速诊断思维断点' : 'Diagnose Visual Gaps'}</p>
                  <p className="text-[11px] text-gray-400">{language === 'ZH' ? '测完自动推荐第1~9阶' : 'Auto-recommends Level 1–9'}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-[#26B7FF] group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '开始5题快速测评' : 'Start 5-Question Test'}</span>
              <ArrowRight size={18} />
            </div>
          </button>

          {/* OPTION B: Choose a Level Directly */}
          <button
            id="entry-option-direct-level"
            onClick={onOpenCourseMenu}
            className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 hover:border-[#333333] hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-[#555555] border border-gray-200">
                  {language === 'ZH' ? '路径 B · 教师自选' : 'OPTION B · TEACHER CHOICE'}
                </span>
                <span className="text-xs font-bold text-gray-400">Level 1–9</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#222222] group-hover:text-black transition-colors">
                  {language === 'ZH' ? '直接选择阶梯' : 'Choose a Level Directly'}
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  {language === 'ZH'
                    ? '跳过测试，直接从第1阶至第9阶任意阶段开始授课。'
                    : 'Skip testing and start teaching from any level (Level 1 to Level 9).'}
                </p>
              </div>

              {/* Visual preview cue */}
              <div className="p-3 bg-[#F6F6F6] rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#333333] text-white flex items-center justify-center shrink-0">
                  <BookOpen size={16} />
                </div>
                <div className="text-xs text-[#555555]">
                  <p className="font-semibold">{language === 'ZH' ? '全览九阶思维脉络' : 'Full 9-Level Curriculum'}</p>
                  <p className="text-[11px] text-gray-400">{language === 'ZH' ? '随时按学生年级随心切换' : 'Select any stage directly'}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-[#333333] group-hover:translate-x-1 transition-transform">
              <span>{language === 'ZH' ? '打开阶梯目录选课' : 'Open Level Menu'}</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="w-full h-14 bg-white border-t border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 text-xs text-[#777777]">
        <span>{language === 'ZH' ? '两组通道随时可用 · 随时调出课程目录' : 'Dual entry pathways · Course menu accessible anytime'}</span>
        <span className="text-[#333333] font-semibold">{language === 'ZH' ? '全屏 16:9 课件' : '16:9 Courseware'}</span>
      </footer>
    </div>
  );
};
