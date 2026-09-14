import React from 'react';
import { VisualStep, Language, ModelConfig } from '../../types';

interface SamAlexCardTransferModelProps {
  currentStep: VisualStep;
  modelConfig?: ModelConfig;
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

export const SamAlexCardTransferModel: React.FC<SamAlexCardTransferModelProps> = ({
  currentStep,
  language,
  renderBracket,
}) => {
  const stepNumber = currentStep.stepNumber ?? 1;

  // Visual phases based on single persistent canvas
  const isDiffHighlighted = stepNumber >= 1;
  const isSplitHighlighted = stepNumber >= 2;
  const isMovedToAlex = stepNumber >= 3;
  const isEqualBracketed = stepNumber >= 4;
  const isInvarianceShown = stepNumber >= 5;

  // Coordinate system
  const START_X = 140;
  const SAM_Y = 110;
  const ALEX_Y = 230;
  const UNIT_W = 38;
  const UNIT_H = 46;
  const GAP = 6;

  const samTotal = 14;
  const alexInitial = 6;
  const transferCount = 4;
  const targetEqual = 10;

  return (
    <g id="sam-alex-card-transfer-canvas" className="transition-all duration-300">
      {/* Title */}
      <text
        x={START_X + 240}
        y={SAM_Y - 50}
        fill="#1E293B"
        fontSize="16"
        fontWeight="800"
        textAnchor="middle"
      >
        {stepNumber === 1 && (language === 'ZH' ? '第 1 步：呈现初始卡牌，标出差量 8 张' : 'Step 1: Initial Cards & Difference of 8')}
        {stepNumber === 2 && (language === 'ZH' ? '第 2 步：将 8 张差量一分为二：8 ÷ 2 = 4 张' : 'Step 2: Split Difference in Half: 8 ÷ 2 = 4 Cards')}
        {stepNumber === 3 && (language === 'ZH' ? '第 3 步：将 4 张卡牌由 Sam 移至 Alex' : 'Step 3: Move the 4 Cards from Sam to Alex')}
        {stepNumber === 4 && (language === 'ZH' ? '第 4 步：两人卡牌数量均等：各 10 张' : 'Step 4: Both Rows Equal: 10 Cards Each')}
        {stepNumber >= 5 && (language === 'ZH' ? '第 5 步：内部转移总数不变：14 + 6 = 10 + 10 = 20' : 'Step 5: Total Remains Invariant: 14 + 6 = 20')}
      </text>

      {/* ROW 1: SAM (Initial 14 cards) */}
      <g id="sam-row">
        {/* Row Label */}
        <text
          x={START_X - 18}
          y={SAM_Y + UNIT_H / 2 + 5}
          fill="#0369A1"
          fontSize="14"
          fontWeight="800"
          textAnchor="end"
        >
          {language === 'ZH' ? 'Sam (14张)' : 'Sam (14)'}
        </text>

        {/* Sam's 14 Units */}
        {Array.from({ length: samTotal }).map((_, i) => {
          const x = START_X + i * (UNIT_W + GAP);
          const isCommon = i < alexInitial; // 0..5
          const isKeep = i >= alexInitial && i < targetEqual; // 6..9
          const isTransfer = i >= targetEqual; // 10..13

          // In Step 3+, the 4 transfer units have moved down!
          if (isTransfer && isMovedToAlex) {
            // Render ghost placeholder where units used to be
            return (
              <g key={`sam-unit-ghost-${i}`}>
                <rect
                  x={x}
                  y={SAM_Y}
                  width={UNIT_W}
                  height={UNIT_H}
                  rx="6"
                  fill="#F8FAFC"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={x + UNIT_W / 2}
                  y={SAM_Y + UNIT_H / 2 + 5}
                  fill="#94A3B8"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  -1
                </text>
              </g>
            );
          }

          // Coloring
          let fill = '#26B7FF';
          let stroke = '#0284C7';
          let textColor = '#FFFFFF';

          if (isTransfer && isSplitHighlighted && !isMovedToAlex) {
            fill = '#FDE700';
            stroke = '#CA8A04';
            textColor = '#333333';
          }

          return (
            <g key={`sam-unit-${i}`} className="transition-all duration-300">
              <rect
                x={x}
                y={SAM_Y}
                width={UNIT_W}
                height={UNIT_H}
                rx="6"
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
              />
              <text
                x={x + UNIT_W / 2}
                y={SAM_Y + UNIT_H / 2 + 5}
                fill={textColor}
                fontSize="12"
                fontWeight="800"
                textAnchor="middle"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Step 1: Top Bracket for 8-card difference */}
        {stepNumber === 1 && (
          renderBracket(
            START_X + alexInitial * (UNIT_W + GAP),
            START_X + samTotal * (UNIT_W + GAP) - GAP,
            SAM_Y - 14,
            language === 'ZH' ? '多出的差量: 14 - 6 = 8 张' : 'Difference: 14 - 6 = 8 cards',
            'top',
            '#0284C7'
          )
        )}

        {/* Step 2: Bracket for 4 transfer cards */}
        {stepNumber === 2 && (
          renderBracket(
            START_X + targetEqual * (UNIT_W + GAP),
            START_X + samTotal * (UNIT_W + GAP) - GAP,
            SAM_Y - 14,
            language === 'ZH' ? '转移部分: 8 ÷ 2 = 4 张' : 'Transfer units: 8 ÷ 2 = 4 cards',
            'top',
            '#CA8A04'
          )
        )}

        {/* Step 4 & 5: Bracket for Sam's final 10 cards */}
        {isEqualBracketed && (
          renderBracket(
            START_X,
            START_X + targetEqual * (UNIT_W + GAP) - GAP,
            SAM_Y - 14,
            language === 'ZH' ? 'Sam 留下: 14 - 4 = 10 张' : 'Sam now: 14 - 4 = 10 cards',
            'top',
            '#0284C7'
          )
        )}
      </g>

      {/* ROW 2: ALEX */}
      <g id="alex-row">
        {/* Row Label */}
        <text
          x={START_X - 18}
          y={ALEX_Y + UNIT_H / 2 + 5}
          fill="#333333"
          fontSize="14"
          fontWeight="800"
          textAnchor="end"
        >
          {language === 'ZH' ? 'Alex (6张)' : 'Alex (6)'}
        </text>

        {/* Alex's 6 Initial Units */}
        {Array.from({ length: alexInitial }).map((_, i) => {
          const x = START_X + i * (UNIT_W + GAP);
          return (
            <g key={`alex-initial-${i}`}>
              <rect
                x={x}
                y={ALEX_Y}
                width={UNIT_W}
                height={UNIT_H}
                rx="6"
                fill="#26B7FF"
                stroke="#0284C7"
                strokeWidth="2"
              />
              <text
                x={x + UNIT_W / 2}
                y={ALEX_Y + UNIT_H / 2 + 5}
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="800"
                textAnchor="middle"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* The 4 Transferred Units (Appearing in Alex's row in Step 3+) */}
        {isMovedToAlex &&
          Array.from({ length: transferCount }).map((_, j) => {
            const i = alexInitial + j;
            const x = START_X + i * (UNIT_W + GAP);

            return (
              <g key={`alex-transferred-${j}`} className="animate-in fade-in zoom-in-95 duration-500">
                <rect
                  x={x}
                  y={ALEX_Y}
                  width={UNIT_W}
                  height={UNIT_H}
                  rx="6"
                  fill="#FDE700"
                  stroke="#CA8A04"
                  strokeWidth="2.5"
                />
                <text
                  x={x + UNIT_W / 2}
                  y={ALEX_Y + UNIT_H / 2 + 5}
                  fill="#333333"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  +{j + 1}
                </text>
              </g>
            );
          })}

        {/* Step 3: Arrow and label showing travel from Sam to Alex */}
        {stepNumber === 3 && (
          <g id="transfer-movement-indicators">
            <path
              d={`M ${START_X + (alexInitial + 2) * (UNIT_W + GAP)} ${SAM_Y + UNIT_H + 8} L ${START_X + (alexInitial + 2) * (UNIT_W + GAP)} ${ALEX_Y - 10}`}
              stroke="#EAB308"
              strokeWidth="3"
              strokeDasharray="4 4"
              markerEnd="url(#transfer-arrowhead)"
            />
            <defs>
              <marker
                id="transfer-arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#EAB308" />
              </marker>
            </defs>
          </g>
        )}

        {/* Step 4 & 5: Bottom Bracket for Alex's final 10 cards */}
        {isEqualBracketed && (
          renderBracket(
            START_X,
            START_X + targetEqual * (UNIT_W + GAP) - GAP,
            ALEX_Y + UNIT_H + 18,
            language === 'ZH' ? 'Alex 得到: 6 + 4 = 10 张' : 'Alex now: 6 + 4 = 10 cards',
            'bottom',
            '#CA8A04'
          )
        )}
      </g>

      {/* Step 5: Invariant Total Summary Badge */}
      {isInvarianceShown && (
        <g id="invariant-total-badge" className="animate-in fade-in duration-300">
          <rect
            x={START_X + 80}
            y={ALEX_Y + UNIT_H + 50}
            width="420"
            height="38"
            rx="12"
            fill="#F8FAFC"
            stroke="#26B7FF"
            strokeWidth="2"
          />
          <text
            x={START_X + 290}
            y={ALEX_Y + UNIT_H + 74}
            fill="#0369A1"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            {language === 'ZH'
              ? '✨ 移动卡牌不改变总数：14 + 6 = 20，10 + 10 = 20'
              : '✨ Moving cards does not change the total: 14 + 6 = 20; 10 + 10 = 20'}
          </text>
        </g>
      )}
    </g>
  );
};
