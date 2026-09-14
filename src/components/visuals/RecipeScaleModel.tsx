import React from 'react';
import { VisualStep, Language, ModelConfig } from '../../types';

interface RecipeScaleModelProps {
  currentStep: VisualStep;
  modelConfig: ModelConfig;
  language: Language;
}

export const RecipeScaleModel: React.FC<RecipeScaleModelProps> = ({
  currentStep,
  modelConfig,
  language,
}) => {
  const stepNumber = currentStep.stepNumber ?? 1;

  const baseYield = modelConfig.baseYield ?? 12;
  const targetYield = modelConfig.targetYield ?? 36;
  const scaleMultiplier = Math.round(targetYield / baseYield);

  const ingredients = modelConfig.ingredients || [
    { nameEN: 'Flour', nameZH: '面粉', amount: 3, unitEN: 'cups', unitZH: '杯', icon: '🌾' },
    { nameEN: 'Sugar', nameZH: '白糖', amount: 2, unitEN: 'cups', unitZH: '杯', icon: '🧂' },
  ];

  // Coordinates
  const BASE_X = 70;
  const BASE_Y = 65;
  const CARD_W = 270;
  const CARD_H = 240;

  const TARGET_X = 490;
  const TARGET_Y = 65;

  const isFlourHighlighted = stepNumber >= 5;

  return (
    <g id="recipe-scale-canvas">
      {/* 1. BASE RECIPE CARD (1x) */}
      <g id="base-recipe-card" className="transition-all duration-300">
        <rect
          x={BASE_X}
          y={BASE_Y}
          width={CARD_W}
          height={CARD_H}
          rx="16"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        {/* Header */}
        <rect
          x={BASE_X}
          y={BASE_Y}
          width={CARD_W}
          height={40}
          rx="16"
          fill="#E2E8F0"
        />
        <text
          x={BASE_X + CARD_W / 2}
          y={BASE_Y + 25}
          fill="#1E293B"
          fontSize="14"
          fontWeight="800"
          textAnchor="middle"
        >
          {language === 'ZH' ? '1 份标准配方 (1× Recipe)' : '1× STANDARD RECIPE'}
        </text>

        {/* Ingredients list */}
        {ingredients.map((ing, idx) => {
          const iy = BASE_Y + 60 + idx * 46;
          const isTargetIng = idx === 0;
          const highlightThis = isTargetIng && isFlourHighlighted;

          return (
            <g key={`base-ing-${idx}`}>
              <rect
                x={BASE_X + 16}
                y={iy}
                width={CARD_W - 32}
                height={38}
                rx="10"
                fill={highlightThis ? '#FEF9C3' : '#FFFFFF'}
                stroke={highlightThis ? '#CA8A04' : '#E2E8F0'}
                strokeWidth={highlightThis ? '2.5' : '1.5'}
              />
              <text
                x={BASE_X + 28}
                y={iy + 24}
                fill="#1E293B"
                fontSize="13"
                fontWeight="700"
              >
                {ing.icon} {language === 'ZH' ? `${ing.amount} ${ing.unitZH} ${ing.nameZH}` : `${ing.amount} ${ing.unitEN} ${ing.nameEN}`}
              </text>
            </g>
          );
        })}

        {/* Base Yield */}
        <rect
          x={BASE_X + 16}
          y={BASE_Y + CARD_H - 58}
          width={CARD_W - 32}
          height={44}
          rx="10"
          fill="#EFF6FF"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <text
          x={BASE_X + CARD_W / 2}
          y={BASE_Y + CARD_H - 30}
          fill="#1D4ED8"
          fontSize="14"
          fontWeight="800"
          textAnchor="middle"
        >
          {language === 'ZH' ? `🍪 烘烤产出：${baseYield} 块饼干` : `🍪 Yields: ${baseYield} Cookies`}
        </text>
      </g>

      {/* 2. SCALE MULTIPLIER (Step 2+) */}
      {stepNumber >= 2 && (
        <g id="scale-multiplier-bridge" className="transition-all duration-300">
          <line
            x1={BASE_X + CARD_W + 10}
            y1={BASE_Y + CARD_H / 2}
            x2={TARGET_X - 10}
            y2={BASE_Y + CARD_H / 2}
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          <polygon
            points={`${TARGET_X - 6},${BASE_Y + CARD_H / 2} ${TARGET_X - 16},${BASE_Y + CARD_H / 2 - 7} ${TARGET_X - 16},${BASE_Y + CARD_H / 2 + 7}`}
            fill="#3B82F6"
          />

          {/* Scale Badge */}
          <circle
            cx={(BASE_X + CARD_W + TARGET_X) / 2}
            cy={BASE_Y + CARD_H / 2}
            r="34"
            fill="#FFFFFF"
            stroke="#3B82F6"
            strokeWidth="3"
          />
          <text
            cx={(BASE_X + CARD_W + TARGET_X) / 2}
            x={(BASE_X + CARD_W + TARGET_X) / 2}
            y={BASE_Y + CARD_H / 2 - 4}
            fill="#1D4ED8"
            fontSize="15"
            fontWeight="900"
            textAnchor="middle"
          >
            {stepNumber >= 3 ? `× ${scaleMultiplier}` : '?'}
          </text>
          <text
            x={(BASE_X + CARD_W + TARGET_X) / 2}
            y={BASE_Y + CARD_H / 2 + 15}
            fill="#64748B"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            {stepNumber >= 3 ? (language === 'ZH' ? '倍数' : 'Scale') : (language === 'ZH' ? '几倍?' : 'Ratio?')}
          </text>
        </g>
      )}

      {/* 3. TARGET RECIPE CARD (Step 2+) */}
      {stepNumber >= 2 && (
        <g id="target-recipe-card" className="transition-all duration-300">
          <rect
            x={TARGET_X}
            y={TARGET_Y}
            width={CARD_W + 40}
            height={CARD_H}
            rx="16"
            fill="#F8FAFC"
            stroke={stepNumber >= 4 ? '#0284C7' : '#CBD5E1'}
            strokeWidth={stepNumber >= 4 ? '2.5' : '2'}
          />
          {/* Header */}
          <rect
            x={TARGET_X}
            y={TARGET_Y}
            width={CARD_W + 40}
            height={40}
            rx="16"
            fill={stepNumber >= 4 ? '#E0F2FE' : '#F1F5F9'}
          />
          <text
            x={TARGET_X + (CARD_W + 40) / 2}
            y={TARGET_Y + 25}
            fill="#0369A1"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            {stepNumber >= 4
              ? (language === 'ZH' ? `${scaleMultiplier} 份配方 (${scaleMultiplier}× Batches)` : `${scaleMultiplier}× RECIPE (${scaleMultiplier} Batches)`)
              : (language === 'ZH' ? '目标配方 (Target Recipe)' : 'TARGET RECIPE')}
          </text>

          {/* Ingredients list for Target */}
          {ingredients.map((ing, idx) => {
            const iy = TARGET_Y + 60 + idx * 46;
            const isTargetIng = idx === 0;
            const highlightThis = isTargetIng && isFlourHighlighted;
            const targetAmount = ing.amount * scaleMultiplier;

            return (
              <g key={`target-ing-${idx}`}>
                <rect
                  x={TARGET_X + 16}
                  y={iy}
                  width={CARD_W + 8}
                  height={38}
                  rx="10"
                  fill={highlightThis ? '#FEF08A' : '#FFFFFF'}
                  stroke={highlightThis ? '#EAB308' : '#E2E8F0'}
                  strokeWidth={highlightThis ? '2.5' : '1.5'}
                />
                <text
                  x={TARGET_X + 28}
                  y={iy + 24}
                  fill={highlightThis ? '#854D0E' : '#1E293B'}
                  fontSize="13"
                  fontWeight="700"
                >
                  {ing.icon} {language === 'ZH' ? ing.nameZH : ing.nameEN}:{' '}
                  {stepNumber >= 6 && isTargetIng ? (
                    <tspan fontWeight="900" fill="#B45309">
                      {ing.amount} × {scaleMultiplier} = {targetAmount} {language === 'ZH' ? ing.unitZH : ing.unitEN} ★
                    </tspan>
                  ) : stepNumber >= 4 ? (
                    `${ing.amount} × ${scaleMultiplier} = ${targetAmount} ${language === 'ZH' ? ing.unitZH : ing.unitEN}`
                  ) : (
                    `? ${language === 'ZH' ? ing.unitZH : ing.unitEN}`
                  )}
                </text>
              </g>
            );
          })}

          {/* Target Yield */}
          <rect
            x={TARGET_X + 16}
            y={TARGET_Y + CARD_H - 58}
            width={CARD_W + 8}
            height={44}
            rx="10"
            fill="#EFF6FF"
            stroke="#26B7FF"
            strokeWidth="2"
          />
          <text
            x={TARGET_X + (CARD_W + 40) / 2}
            y={TARGET_Y + CARD_H - 30}
            fill="#0369A1"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            {language === 'ZH' ? `🍪 目标产出：${targetYield} 块饼干` : `🍪 Target Yield: ${targetYield} Cookies`}
          </text>
        </g>
      )}

      {/* 4. BOTTOM DEDUCTION FORMULA (Step 3+) */}
      {stepNumber >= 3 && (
        <g id="recipe-bottom-deduction" className="transition-all duration-300">
          <rect
            x={BASE_X}
            y={BASE_Y + CARD_H + 20}
            width={CARD_W + TARGET_X - BASE_X + 40}
            height={52}
            rx="12"
            fill="#FEFCE8"
            stroke="#EAB308"
            strokeWidth="1.5"
          />
          <text
            x={(BASE_X + TARGET_X + CARD_W + 40) / 2}
            y={BASE_Y + CARD_H + 52}
            fill="#854D0E"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            {stepNumber < 6
              ? (language === 'ZH'
                  ? `产出关系：${targetYield} ÷ ${baseYield} = ${scaleMultiplier} 倍配方`
                  : `Yield Ratio: ${targetYield} ÷ ${baseYield} = ${scaleMultiplier}× Batches`)
              : (language === 'ZH'
                  ? `所求面粉：3 杯 × ${scaleMultiplier} = 9 杯面粉！`
                  : `Flour Required: 3 cups × ${scaleMultiplier} = 9 cups of flour!`)}
          </text>
        </g>
      )}
    </g>
  );
};
