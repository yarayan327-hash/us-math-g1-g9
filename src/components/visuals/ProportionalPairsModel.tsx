import React from 'react';
import { VisualStep, Language, ModelConfig } from '../../types';

interface ProportionalPairsModelProps {
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

export const ProportionalPairsModel: React.FC<ProportionalPairsModelProps> = ({
  currentStep,
  modelConfig,
  language,
  renderBracket,
}) => {
  const stepNumber = currentStep.stepNumber ?? 1;

  const pairA = modelConfig.pairUnitsA ?? 2;
  const pairB = modelConfig.pairUnitsB ?? 4;
  const targetA = modelConfig.targetUnitsA ?? 10;
  const unitRate = Math.round(pairB / pairA);
  const totalB = targetA * unitRate;

  const labelA = language === 'ZH' ? modelConfig.pairNameZH_A || '杯冰沙' : modelConfig.pairNameEN_A || 'Smoothies';
  const labelB = language === 'ZH' ? modelConfig.pairNameZH_B || '颗草莓' : modelConfig.pairNameEN_B || 'Strawberries';
  const iconA = modelConfig.pairIconA || '🥤';
  const iconB = modelConfig.pairIconB || '🍓';

  // Coordinates
  const LEFT_X = 60;
  const GIVEN_Y = 65;
  const GIVEN_W = 270;
  const GIVEN_H = 105;

  const UNIT_Y = 215;
  const UNIT_H = 110;

  const TARGET_X = 380;
  const TARGET_Y = 85;

  return (
    <g id="proportional-pairs-canvas">
      {/* 1. GIVEN PROPORTIONAL PAIR */}
      <g id="given-pair-card" className="transition-all duration-300">
        <rect
          x={LEFT_X}
          y={GIVEN_Y}
          width={GIVEN_W}
          height={GIVEN_H}
          rx="14"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <text
          x={LEFT_X + 16}
          y={GIVEN_Y + 24}
          fill="#64748B"
          fontSize="11"
          fontWeight="800"
        >
          {language === 'ZH' ? '已知配比关系 (GIVEN RATIO)' : 'GIVEN PROPORTIONAL PAIR'}
        </text>

        {/* 2 smoothies */}
        <rect
          x={LEFT_X + 16}
          y={GIVEN_Y + 38}
          width={88}
          height={48}
          rx="10"
          fill="#E0F2FE"
          stroke="#0284C7"
          strokeWidth="1.5"
        />
        <text
          x={LEFT_X + 60}
          y={GIVEN_Y + 67}
          fill="#0369A1"
          fontSize="13"
          fontWeight="800"
          textAnchor="middle"
        >
          {pairA} {iconA}
        </text>

        <text
          x={LEFT_X + 124}
          y={GIVEN_Y + 68}
          fill="#64748B"
          fontSize="18"
          fontWeight="900"
          textAnchor="middle"
        >
          ↔
        </text>

        {/* 4 strawberries */}
        <rect
          x={LEFT_X + 144}
          y={GIVEN_Y + 38}
          width={110}
          height={48}
          rx="10"
          fill="#FEE2E2"
          stroke="#EF4444"
          strokeWidth="1.5"
        />
        <text
          x={LEFT_X + 199}
          y={GIVEN_Y + 67}
          fill="#B91C1C"
          fontSize="13"
          fontWeight="800"
          textAnchor="middle"
        >
          {pairB} {iconB}
        </text>
      </g>

      {/* 2. DIVISION TO 1 UNIT PAIR (Step 2+) */}
      {stepNumber >= 2 && (
        <g id="division-to-unit" className="transition-all duration-300">
          <line
            x1={LEFT_X + GIVEN_W / 2}
            y1={GIVEN_Y + GIVEN_H + 2}
            x2={LEFT_X + GIVEN_W / 2}
            y2={UNIT_Y - 4}
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <polygon
            points={`${LEFT_X + GIVEN_W / 2},${UNIT_Y - 2} ${LEFT_X + GIVEN_W / 2 - 6},${UNIT_Y - 10} ${LEFT_X + GIVEN_W / 2 + 6},${UNIT_Y - 10}`}
            fill="#94A3B8"
          />
          <rect
            x={LEFT_X + GIVEN_W / 2 - 32}
            y={GIVEN_Y + GIVEN_H + 12}
            width={64}
            height={22}
            rx="11"
            fill="#FFFFFF"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          <text
            x={LEFT_X + GIVEN_W / 2}
            y={GIVEN_Y + GIVEN_H + 27}
            fill="#1D4ED8"
            fontSize="11"
            fontWeight="800"
            textAnchor="middle"
          >
            ÷ {pairA}
          </text>
        </g>
      )}

      {/* 3. UNIT RATE CARD (Step 2+) */}
      {stepNumber >= 2 && (
        <g id="unit-pair-card" className="transition-all duration-300">
          <rect
            x={LEFT_X}
            y={UNIT_Y}
            width={GIVEN_W}
            height={UNIT_H}
            rx="14"
            fill="#FEFCE8"
            stroke="#EAB308"
            strokeWidth="2.5"
          />
          <text
            x={LEFT_X + 16}
            y={UNIT_Y + 24}
            fill="#854D0E"
            fontSize="11"
            fontWeight="800"
          >
            {language === 'ZH' ? '★ 基准配对（做1杯需要）' : '★ 1 UNIT PAIR (RATE)'}
          </text>

          {/* 1 smoothie */}
          <rect
            x={LEFT_X + 16}
            y={UNIT_Y + 38}
            width={88}
            height={48}
            rx="10"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="2"
          />
          <text
            x={LEFT_X + 60}
            y={UNIT_Y + 68}
            fill="#0369A1"
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
          >
            1 {iconA}
          </text>

          <text
            x={LEFT_X + 124}
            y={UNIT_Y + 68}
            fill="#64748B"
            fontSize="18"
            fontWeight="900"
            textAnchor="middle"
          >
            ↔
          </text>

          {/* 2 strawberries */}
          <rect
            x={LEFT_X + 144}
            y={UNIT_Y + 38}
            width={110}
            height={48}
            rx="10"
            fill="#FEE2E2"
            stroke="#DC2626"
            strokeWidth="2"
          />
          <text
            x={LEFT_X + 199}
            y={UNIT_Y + 68}
            fill="#B91C1C"
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
          >
            {unitRate} {iconB}
          </text>
        </g>
      )}

      {/* 4. TARGET 10 SMOOTHIES (Step 3+) */}
      {stepNumber >= 3 && (
        <g id="target-grid-expansion" className="transition-all duration-300">
          <text
            x={TARGET_X}
            y={TARGET_Y - 20}
            fill="#1E293B"
            fontSize="15"
            fontWeight="800"
          >
            {language === 'ZH' ? `目标：制作 ${targetA} ${labelA}` : `Target: Make ${targetA} ${labelA}`}
          </text>

          {/* 10 Smoothie Units (2 rows of 5 for clear presentation) */}
          {Array.from({ length: targetA }).map((_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const bx = TARGET_X + col * 92;
            const by = TARGET_Y + row * 64;

            return (
              <g key={`target-pair-${i}`}>
                <rect
                  x={bx}
                  y={by}
                  width={84}
                  height={54}
                  rx="10"
                  fill="#F8FAFC"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <text
                  x={bx + 20}
                  y={by + 33}
                  fontSize="16"
                  textAnchor="middle"
                >
                  {iconA}
                </text>
                <text
                  x={bx + 54}
                  y={by + 33}
                  fill="#B91C1C"
                  fontSize="13"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {stepNumber >= 4 ? `${unitRate} ${iconB}` : `? ${iconB}`}
                </text>
              </g>
            );
          })}

          {/* Step 5: Final Equation Bracket */}
          {stepNumber >= 5 && (
            renderBracket(
              TARGET_X,
              TARGET_X + 5 * 92 - 8,
              TARGET_Y + 2 * 64 + 10,
              language === 'ZH'
                ? `总需草莓 = ${targetA} × ${unitRate} = ${totalB} ${labelB} 🍓`
                : `Total Needed = ${targetA} × ${unitRate} = ${totalB} ${labelB} 🍓`,
              'bottom',
              '#333333'
            )
          )}
        </g>
      )}
    </g>
  );
};
