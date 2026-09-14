import React from 'react';
import { VisualStep, Language, ModelConfig } from '../../types';

interface StickerPackScaleModelProps {
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

export const StickerPackScaleModel: React.FC<StickerPackScaleModelProps> = ({
  currentStep,
  language,
  renderBracket,
}) => {
  const stepNumber = currentStep.stepNumber ?? 1;

  // Visual state progression
  const showMultiplePacks = stepNumber >= 2;
  const showGlitterScaled = stepNumber >= 3;
  const showFinalAnswer = stepNumber >= 4;

  const totalPacks = 5;
  const glowPerPack = 5;
  const glitterPerPack = 3;

  // Canvas dimensions
  const CANVAS_WIDTH = 840;
  const CANVAS_HEIGHT = 400;

  // Single pack coordinates (Step 1)
  const S1_PACK_X = 260;
  const S1_PACK_Y = 100;
  const S1_PACK_W = 320;
  const S1_PACK_H = 180;

  // Multi-pack coordinates (Steps 2 - 4)
  const PACK_W = 145;
  const PACK_GAP = 16;
  const START_X = Math.floor((CANVAS_WIDTH - (totalPacks * PACK_W + (totalPacks - 1) * PACK_GAP)) / 2);
  const PACK_Y = 80;
  const PACK_H = 220;

  // Block dimensions inside packs
  const GLOW_COLOR = '#26B7FF';
  const GLITTER_COLOR = '#FDE700';

  if (!showMultiplePacks) {
    // STEP 1: ONE PACK
    return (
      <g id="sticker-pack-canvas" className="transition-all duration-300">
        <text
          x={CANVAS_WIDTH / 2}
          y={S1_PACK_Y - 30}
          fill="#333333"
          fontSize="17"
          fontWeight="800"
          textAnchor="middle"
        >
          {language === 'ZH' ? '第 1 步：观察 1 包贴纸的构成' : 'Step 1: Inspect ONE Craft Sticker Pack'}
        </text>

        {/* 1 Pack Container Box */}
        <rect
          x={S1_PACK_X}
          y={S1_PACK_Y}
          width={S1_PACK_W}
          height={S1_PACK_H}
          rx="18"
          fill="#F8FAFC"
          stroke="#26B7FF"
          strokeWidth="3"
          className="shadow-sm"
        />

        {/* Pack Header Badge */}
        <rect
          x={S1_PACK_X}
          y={S1_PACK_Y}
          width={S1_PACK_W}
          height="38"
          rx="16"
          fill="#26B7FF"
        />
        <text
          x={S1_PACK_X + S1_PACK_W / 2}
          y={S1_PACK_Y + 24}
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="800"
          textAnchor="middle"
        >
          {language === 'ZH' ? '📦 1 张手作贴纸包 (1 Pack)' : '📦 1 Craft Sticker Pack'}
        </text>

        {/* Row 1: 5 Glow Stickers (Blue) */}
        <g id="s1-glow-row">
          <text
            x={S1_PACK_X + 16}
            y={S1_PACK_Y + 65}
            fill="#0369A1"
            fontSize="12"
            fontWeight="800"
          >
            {language === 'ZH' ? '5张 荧光贴纸 (Glow)' : '5 Glow Stickers'}
          </text>
          {Array.from({ length: glowPerPack }).map((_, i) => {
            const bx = S1_PACK_X + 16 + i * (50 + 8);
            const by = S1_PACK_Y + 75;
            return (
              <g key={`s1-glow-${i}`}>
                <rect
                  x={bx}
                  y={by}
                  width="50"
                  height="34"
                  rx="6"
                  fill={GLOW_COLOR}
                  stroke="#0284C7"
                  strokeWidth="2"
                />
                <text
                  x={bx + 25}
                  y={by + 21}
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  🌟 {i + 1}
                </text>
              </g>
            );
          })}
        </g>

        {/* Row 2: 3 Glitter Stickers (Yellow) */}
        <g id="s1-glitter-row">
          <text
            x={S1_PACK_X + 16}
            y={S1_PACK_Y + 128}
            fill="#854D0E"
            fontSize="12"
            fontWeight="800"
          >
            {language === 'ZH' ? '3张 闪光贴纸 (Glitter)' : '3 Glitter Stickers'}
          </text>
          {Array.from({ length: glitterPerPack }).map((_, i) => {
            const bx = S1_PACK_X + 16 + i * (50 + 8);
            const by = S1_PACK_Y + 138;
            return (
              <g key={`s1-glitter-${i}`}>
                <rect
                  x={bx}
                  y={by}
                  width="50"
                  height="34"
                  rx="6"
                  fill={GLITTER_COLOR}
                  stroke="#CA8A04"
                  strokeWidth="2"
                />
                <text
                  x={bx + 25}
                  y={by + 21}
                  fill="#333333"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  ✨ {i + 1}
                </text>
              </g>
            );
          })}
        </g>

        {/* Bottom Bracket for 1 Pack */}
        {renderBracket(
          S1_PACK_X,
          S1_PACK_X + S1_PACK_W,
          S1_PACK_Y + S1_PACK_H + 18,
          language === 'ZH' ? '1包内含：5张荧光 + 3张闪光' : '1 Pack = 5 Glow + 3 Glitter',
          'bottom',
          '#333333'
        )}
      </g>
    );
  }

  // STEPS 2, 3, 4: VISUAL SCALE TO 5 PACKS ON ONE PERSISTENT CANVAS
  return (
    <g id="sticker-pack-canvas" className="transition-all duration-300">
      {/* Dynamic Title / Phase Indicator */}
      <text
        x={CANVAS_WIDTH / 2}
        y={PACK_Y - 45}
        fill="#333333"
        fontSize="16"
        fontWeight="800"
        textAnchor="middle"
      >
        {stepNumber === 2
          ? (language === 'ZH' ? '25张荧光贴纸 ÷ 每包5张 = 5包贴纸' : '25 Glow Stickers ÷ 5 per Pack = 5 Packs!')
          : (language === 'ZH' ? '5包贴纸 × 每包3张闪光 = 15张闪光贴纸' : '5 Packs × 3 Glitter per Pack = 15 Glitter Stickers')}
      </text>

      {/* Render 5 Distinct Packs */}
      {Array.from({ length: totalPacks }).map((_, pIdx) => {
        const px = START_X + pIdx * (PACK_W + PACK_GAP);
        const isTargetActive = showGlitterScaled;

        return (
          <g key={`pack-${pIdx}`} id={`pack-${pIdx}`} className="transition-all duration-300">
            {/* Pack Outer Card */}
            <rect
              x={px}
              y={PACK_Y}
              width={PACK_W}
              height={PACK_H}
              rx="14"
              fill="#FFFFFF"
              stroke={isTargetActive ? '#CA8A04' : '#26B7FF'}
              strokeWidth={isTargetActive ? '2.5' : '2'}
              className="shadow-sm"
            />

            {/* Pack Header */}
            <rect
              x={px}
              y={PACK_Y}
              width={PACK_W}
              height="28"
              rx="12"
              fill={isTargetActive ? '#FEF08A' : '#E0F2FE'}
            />
            <text
              x={px + PACK_W / 2}
              y={PACK_Y + 18}
              fill="#1E293B"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
            >
              {language === 'ZH' ? `第 ${pIdx + 1} 包` : `Pack ${pIdx + 1}`}
            </text>

            {/* Glow Stickers inside this pack: 5 blocks in 1 row */}
            <g id={`pack-${pIdx}-glow`}>
              <text
                x={px + 8}
                y={PACK_Y + 44}
                fill="#0284C7"
                fontSize="10"
                fontWeight="700"
              >
                {language === 'ZH' ? '荧光 5张' : '5 Glow'}
              </text>
              <div className="flex gap-1">
                {Array.from({ length: glowPerPack }).map((_, gIdx) => {
                  const gw = 22;
                  const gx = px + 8 + gIdx * (gw + 3);
                  const gy = PACK_Y + 50;
                  return (
                    <rect
                      key={`p${pIdx}-glow-${gIdx}`}
                      x={gx}
                      y={gy}
                      width={gw}
                      height="38"
                      rx="4"
                      fill={GLOW_COLOR}
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      opacity={showGlitterScaled ? 0.45 : 1}
                    />
                  );
                })}
              </div>
            </g>

            {/* Divider inside pack */}
            <line
              x1={px + 8}
              y1={PACK_Y + 104}
              x2={px + PACK_W - 8}
              y2={PACK_Y + 104}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Glitter Stickers inside this pack: 3 blocks */}
            <g id={`pack-${pIdx}-glitter`}>
              <text
                x={px + 8}
                y={PACK_Y + 124}
                fill={showGlitterScaled ? '#854D0E' : '#94A3B8'}
                fontSize="10"
                fontWeight="700"
              >
                {language === 'ZH' ? '闪光 3张' : '3 Glitter'}
              </text>
              {Array.from({ length: glitterPerPack }).map((_, glIdx) => {
                const glw = 38;
                const glx = px + 8 + glIdx * (glw + 5);
                const gly = PACK_Y + 132;
                const fill = showGlitterScaled ? GLITTER_COLOR : '#F1F5F9';
                const stroke = showGlitterScaled ? '#CA8A04' : '#CBD5E1';

                return (
                  <g key={`p${pIdx}-glitter-${glIdx}`}>
                    <rect
                      x={glx}
                      y={gly}
                      width={glw}
                      height="58"
                      rx="6"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={showGlitterScaled ? '2' : '1'}
                      strokeDasharray={showGlitterScaled ? 'none' : '3 3'}
                      className="transition-all duration-300"
                    />
                    {showGlitterScaled && (
                      <text
                        x={glx + glw / 2}
                        y={gly + 34}
                        fill="#333333"
                        fontSize="12"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        ✨
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        );
      })}

      {/* Top Bracket across all 5 packs for Glow stickers in Step 2 */}
      {!showGlitterScaled && (
        renderBracket(
          START_X,
          START_X + totalPacks * PACK_W + (totalPacks - 1) * PACK_GAP,
          PACK_Y - 14,
          language === 'ZH' ? '25张荧光贴纸 ÷ 每包5张 = 5包' : '25 Glow Stickers ÷ 5 per Pack = 5 Packs',
          'top',
          '#0284C7'
        )
      )}

      {/* Bottom Bracket across all glitter stickers in Step 3 & 4 */}
      {showGlitterScaled && (
        renderBracket(
          START_X,
          START_X + totalPacks * PACK_W + (totalPacks - 1) * PACK_GAP,
          PACK_Y + PACK_H + 18,
          language === 'ZH' ? '5包 × 每包3张 = 15张闪光贴纸' : '5 Packs × 3 Glitter = 15 Glitter Stickers in total',
          'bottom',
          '#CA8A04'
        )
      )}

      {/* Final Answer Banner in Step 4 */}
      {showFinalAnswer && (
        <g id="final-answer-banner">
          <rect
            x={CANVAS_WIDTH / 2 - 170}
            y={PACK_Y + PACK_H + 48}
            width="340"
            height="36"
            rx="12"
            fill="#FEF08A"
            stroke="#CA8A04"
            strokeWidth="2"
          />
          <text
            x={CANVAS_WIDTH / 2}
            y={PACK_Y + PACK_H + 71}
            fill="#854D0E"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            {language === 'ZH' ? '答：Zoe 一共得到了 15 张闪光贴纸！' : 'Answer: Zoe received 15 glitter stickers!'}
          </text>
        </g>
      )}
    </g>
  );
};
