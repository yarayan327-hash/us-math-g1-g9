import React from 'react';
import { VisualStep, Language, ModelConfig } from '../../types';

interface MiaCandyReverseModelProps {
  currentStep: VisualStep;
  modelConfig: ModelConfig;
  language: Language;
  renderBracket: (
    startX: number,
    endX: number,
    y: number,
    label: string,
    position: 'top' | 'bottom',
    color?: string
  ) => React.ReactNode;
}

export const MiaCandyReverseModel: React.FC<MiaCandyReverseModelProps> = ({
  currentStep,
  language,
  renderBracket,
}) => {
  const stepNumber = currentStep.stepNumber ?? 1;

  // Exact fixed coordinates across all steps
  const BAR_X = 120;
  const BAR_Y = 150;
  const TOTAL_W = 660;
  const BAR_H = 64;
  const HALF_W = 330;

  // Brother gets 4, Mia has 6 left (Ratio 4:6 = 40% : 60% of half)
  const BROTHER_W = 132;
  const MIA_LEFT_W = 198;

  const sisterGiven = stepNumber >= 2;
  const brotherGiven = stepNumber >= 3;
  const miaLeftKnown = stepNumber >= 4;
  const halfDeduced = stepNumber >= 5;
  const wholeRebuilt = stepNumber >= 6;

  return (
    <g id="mia-candy-reverse-canvas">
      {/* Visual Title / Context Header */}
      <text
        x={BAR_X}
        y={BAR_Y - 50}
        fill="#333333"
        fontSize="15"
        fontWeight="800"
      >
        {language === 'ZH' ? '糖果总数模型 · 逆向还原法' : 'Mia’s Candy Bag · Reverse Fraction Model'}
      </text>

      {/* 1. LEFT HALF: SISTER (1/2) */}
      <g id="sister-half-group" className="transition-all duration-300">
        <rect
          x={BAR_X}
          y={BAR_Y}
          width={HALF_W}
          height={BAR_H}
          rx="10"
          fill={wholeRebuilt ? '#26B7FF' : sisterGiven ? '#F3F4F6' : '#26B7FF'}
          stroke={wholeRebuilt ? '#0284C7' : sisterGiven ? '#94A3B8' : '#0284C7'}
          strokeWidth={wholeRebuilt ? '2.5' : '2'}
          strokeDasharray={wholeRebuilt ? 'none' : sisterGiven ? '4 4' : 'none'}
          opacity={sisterGiven && !wholeRebuilt ? 0.6 : 1}
        />
        <text
          x={BAR_X + HALF_W / 2}
          y={BAR_Y + BAR_H / 2 + 6}
          fill={wholeRebuilt ? '#FFFFFF' : sisterGiven ? '#64748B' : '#FFFFFF'}
          fontSize={wholeRebuilt ? '18' : '14'}
          fontWeight="800"
          textAnchor="middle"
        >
          {wholeRebuilt
            ? (language === 'ZH' ? '姐姐的 1/2 = 10 颗 🍬' : 'Sister’s 1/2 = 10 🍬')
            : sisterGiven
              ? (language === 'ZH' ? '分给姐姐的 1/2 (已送出)' : 'Sister: 1/2 (Given away)')
              : (language === 'ZH' ? '整袋糖果的前半部分 (1/2)' : 'First 1/2 of candy bag')}
        </text>
      </g>

      {/* 2. RIGHT HALF: REMAINING HALF */}
      <g id="remaining-half-group" className="transition-all duration-300">
        {!brotherGiven ? (
          // Step 1 & 2: Solid single block for right half
          <g>
            <rect
              x={BAR_X + HALF_W}
              y={BAR_Y}
              width={HALF_W}
              height={BAR_H}
              rx="10"
              fill="#26B7FF"
              stroke="#0284C7"
              strokeWidth="2"
            />
            <text
              x={BAR_X + HALF_W + HALF_W / 2}
              y={BAR_Y + BAR_H / 2 + 6}
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
            >
              {language === 'ZH' ? '剩余的 1/2 糖果' : 'Remaining 1/2 of candy bag'}
            </text>
          </g>
        ) : (
          // Step 3+: Divided into Brother (4) and Mia remaining (6)
          <g>
            {/* Brother's 4 candies */}
            <rect
              x={BAR_X + HALF_W}
              y={BAR_Y}
              width={BROTHER_W}
              height={BAR_H}
              rx="8"
              fill="#FEF9C3"
              stroke="#CA8A04"
              strokeWidth="2"
            />
            <text
              x={BAR_X + HALF_W + BROTHER_W / 2}
              y={BAR_Y + BAR_H / 2 + 6}
              fill="#854D0E"
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
            >
              {language === 'ZH' ? '弟弟: 4颗' : 'Brother: 4'}
            </text>

            {/* Mia's remaining 6 candies */}
            <rect
              x={BAR_X + HALF_W + BROTHER_W}
              y={BAR_Y}
              width={MIA_LEFT_W}
              height={BAR_H}
              rx="8"
              fill={wholeRebuilt ? '#BAE6FD' : '#FFFFFF'}
              stroke="#0284C7"
              strokeWidth="2"
            />
            <text
              x={BAR_X + HALF_W + BROTHER_W + MIA_LEFT_W / 2}
              y={BAR_Y + BAR_H / 2 + 6}
              fill="#0369A1"
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
            >
              {miaLeftKnown
                ? (language === 'ZH' ? 'Mia 剩余: 6颗' : 'Mia left: 6')
                : (language === 'ZH' ? '剩余部分' : 'Remaining')}
            </text>
          </g>
        )}
      </g>

      {/* 3. BRACKETS & ANNOTATIONS */}
      {/* Step 1: Bottom bracket for unknown total */}
      {stepNumber === 1 && (
        renderBracket(
          BAR_X,
          BAR_X + TOTAL_W,
          BAR_Y + BAR_H + 16,
          language === 'ZH' ? '原有整袋糖果 = ? 颗' : 'Original bag = ? candies',
          'bottom',
          '#333333'
        )
      )}

      {/* Step 5+: Top bracket over the right half (4 + 6 = 10) */}
      {halfDeduced && (
        renderBracket(
          BAR_X + HALF_W,
          BAR_X + TOTAL_W,
          BAR_Y - 14,
          language === 'ZH'
            ? '半袋糖果 = 4 (弟弟) + 6 (自留) = 10 颗 🍬'
            : 'Half bag = 4 (Brother) + 6 (Mia) = 10 candies 🍬',
          'top',
          '#0284C7'
        )
      )}

      {/* Step 6: Bottom bracket across the whole rebuilt bar */}
      {wholeRebuilt && (
        renderBracket(
          BAR_X,
          BAR_X + TOTAL_W,
          BAR_Y + BAR_H + 16,
          language === 'ZH'
            ? '原来整袋糖果 = 10 + 10 = 20 颗！(算式: 10 × 2 = 20)'
            : 'Original whole bag = 10 + 10 = 20 candies! (10 × 2 = 20)',
          'bottom',
          '#0284C7'
        )
      )}
    </g>
  );
};
