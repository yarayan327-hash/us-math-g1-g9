import React from 'react';
import { Activity, Language, VisualStep } from '../../types';
import { ScaleUnitRateModel } from './ScaleUnitRateModel';
import { RecipeScaleModel } from './RecipeScaleModel';
import { ProportionalPairsModel } from './ProportionalPairsModel';
import { MiaCandyReverseModel } from './MiaCandyReverseModel';
import { NestedFractionRemainderModel } from './NestedFractionRemainderModel';
import { CardTransferInvarianceModel } from './CardTransferInvarianceModel';
import { StickerPackScaleModel } from './StickerPackScaleModel';
import { SamAlexCardTransferModel } from './SamAlexCardTransferModel';

interface ModelStageProps {
  activity: Activity;
  currentStep: VisualStep;
  language: Language;
  selectedUnits: number[];
  onUnitTap?: (index: number) => void;
  isInteractiveTapActive?: boolean;
}

export const ModelStage: React.FC<ModelStageProps> = ({
  activity,
  currentStep,
  language,
  selectedUnits,
  onUnitTap,
  isInteractiveTapActive = false
}) => {
  const { maxUnits, modelType, modelConfig } = activity;

  // Determine if row labels are present to adjust left margin
  const hasRowLabels = Boolean(
    modelConfig.row1LabelEN ||
    modelConfig.row2LabelEN ||
    modelType === 'system_elimination' ||
    modelType === 'comparison_two_rows' ||
    modelType === 'ratio_rows' ||
    modelType === 'same_and_different'
  );
  const PADDING_LEFT = hasRowLabels ? 140 : 60;
  const PADDING_RIGHT = 50;
  const BASE_WIDTH = 900;
  const STAGE_HEIGHT = 420;

  // Responsive gap based on unit count
  const GAP = maxUnits > 24 ? 2 : maxUnits > 16 ? 3 : maxUnits > 10 ? 4 : 5;

  // Maximum width available for blocks
  const AVAILABLE_WIDTH = BASE_WIDTH - PADDING_LEFT - PADDING_RIGHT;

  // Exact fixed unit width based on maxUnits pre-calculation
  const calculatedUnitWidth = Math.floor((AVAILABLE_WIDTH - (maxUnits - 1) * GAP) / Math.max(maxUnits, 1));
  const UNIT_WIDTH = Math.max(18, Math.min(68, calculatedUnitWidth));

  // Adaptive unit height based on width
  const UNIT_HEIGHT = UNIT_WIDTH < 25 ? 40 : UNIT_WIDTH < 35 ? 46 : 54;

  // Dynamic STAGE_WIDTH ensures that even with very high unit counts, the SVG viewBox scales without clipping
  const totalContentWidth = PADDING_LEFT + maxUnits * UNIT_WIDTH + (maxUnits - 1) * GAP + PADDING_RIGHT + 20;
  const STAGE_WIDTH = Math.max(BASE_WIDTH, totalContentWidth);

  // Dynamic typography and border radius
  const blockFontSize = UNIT_WIDTH < 22 ? '10' : UNIT_WIDTH < 28 ? '11' : UNIT_WIDTH < 38 ? '13' : '15';
  const blockRx = Math.min(8, Math.max(2, Math.floor(UNIT_WIDTH / 4)));
  const textOffsetY = UNIT_HEIGHT / 2 + (UNIT_HEIGHT < 48 ? 4 : 5);

  // Fixed vertical row coordinates
  const ROW1_Y =
    modelType === 'comparison_two_rows' ||
    modelType === 'same_and_different' ||
    modelType === 'ratio_rows' ||
    modelType === 'system_elimination'
      ? 130
      : 165;
  const ROW2_Y = ROW1_Y + UNIT_HEIGHT + 56;

  const getUnitX = (index: number) => PADDING_LEFT + index * (UNIT_WIDTH + GAP);

  // Helper to draw bracket paths with adaptive curves and strict boundary clamping
  const renderBracket = (
    startX: number,
    endX: number,
    y: number,
    label: string,
    position: 'bottom' | 'top' = 'bottom',
    color = '#333333'
  ) => {
    const span = Math.max(1, endX - startX);
    const midX = (startX + endX) / 2;
    const bracketDepth = span < 40 ? 6 : span < 80 ? 8 : 11;
    const sign = position === 'bottom' ? 1 : -1;
    const textY = y + (position === 'bottom' ? bracketDepth + 18 : -(bracketDepth + 8));

    // Ensure text label never bleeds outside the canvas edges
    const textX = Math.max(PADDING_LEFT + 25, Math.min(STAGE_WIDTH - 60, midX));

    const cornerR = Math.min(8, Math.max(2, span / 5));
    const midNudge = Math.min(7, span / 6);

    const path = `
      M ${startX} ${y}
      Q ${startX} ${y + sign * bracketDepth}, ${startX + cornerR} ${y + sign * bracketDepth}
      L ${midX - midNudge} ${y + sign * bracketDepth}
      Q ${midX} ${y + sign * (bracketDepth + 5)}, ${midX} ${y + sign * (bracketDepth + 7)}
      Q ${midX} ${y + sign * (bracketDepth + 5)}, ${midX + midNudge} ${y + sign * bracketDepth}
      L ${endX - cornerR} ${y + sign * bracketDepth}
      Q ${endX} ${y + sign * bracketDepth}, ${endX} ${y}
    `;

    const labelFontSize = span < 40 ? '11' : span < 70 ? '12' : '13';

    return (
      <g className="transition-all duration-300">
        <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <text
          x={textX}
          y={textY}
          fill={color}
          fontSize={labelFontSize}
          fontWeight="600"
          textAnchor="middle"
          className="font-sans select-none"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between min-h-0 overflow-hidden">
      {/* SVG Canvas with exact viewBox */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-full max-w-full drop-shadow-xs select-none"
        >
          {/* Subtle Grid baseline reference */}
          <line
            x1={PADDING_LEFT}
            y1="60"
            x2={PADDING_LEFT}
            y2={STAGE_HEIGHT - 60}
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text
            x={PADDING_LEFT}
            y="52"
            fontSize="11"
            fontWeight="600"
            fill="#9CA3AF"
            textAnchor="middle"
            className="select-none tracking-wider uppercase"
          >
            Baseline
          </text>

          {/* Row 1 Label */}
          {modelConfig.row1LabelEN && (
            <text
              x={PADDING_LEFT - 18}
              y={ROW1_Y + UNIT_HEIGHT / 2 + 5}
              fill="#333333"
              fontSize="14"
              fontWeight="700"
              textAnchor="end"
              className="select-none"
            >
              {language === 'ZH' ? modelConfig.row1LabelZH || modelConfig.row1LabelEN : modelConfig.row1LabelEN}
            </text>
          )}

          {/* Row 2 Label */}
          {modelConfig.row2LabelEN && (
            <text
              x={PADDING_LEFT - 18}
              y={ROW2_Y + UNIT_HEIGHT / 2 + 5}
              fill="#333333"
              fontSize="14"
              fontWeight="700"
              textAnchor="end"
              className="select-none"
            >
              {language === 'ZH' ? modelConfig.row2LabelZH || modelConfig.row2LabelEN : modelConfig.row2LabelEN}
            </text>
          )}

          {/* SINGLE ROW ADD / SUBTRACTION */}
          {modelType === 'single_row_add_sub' && (
            <g id="single-row-add-sub-group">
              {/* Render units */}
              {Array.from({ length: maxUnits }).map((_, i) => {
                const isBaseUnit = i < (currentStep.visibleUnitsCount ?? (modelConfig.baseCount || 0));
                const isAddedUnit =
                  currentStep.addedUnitsCount &&
                  i >= (modelConfig.baseCount || 0) &&
                  i < (modelConfig.baseCount || 0) + (currentStep.addedUnitsCount || 0);

                const isRemovedUnit =
                  currentStep.removedUnitsCount &&
                  i >= (modelConfig.baseCount || 0) - (currentStep.removedUnitsCount || 0) &&
                  i < (modelConfig.baseCount || 0);

                if (!isBaseUnit && !isAddedUnit && !isRemovedUnit) return null;

                const x = getUnitX(i);
                const y = ROW1_Y;
                const isSelected = selectedUnits.includes(i);

                let fill = '#FFFFFF';
                let stroke = '#333333';
                let strokeDash = 'none';
                let opacity = 1;

                if (isAddedUnit) {
                  fill = '#FDE700'; // Accent yellow for new added units
                  stroke = '#333333';
                } else if (isRemovedUnit && (currentStep.removedUnitsCount ?? 0) > 0) {
                  // Subtraction: units on the right become dashed gray with reduced opacity
                  if (currentStep.stepNumber >= 3) {
                    opacity = 0.2;
                  } else {
                    opacity = 0.6;
                  }
                  fill = '#F6F6F6';
                  stroke = '#999999';
                  strokeDash = '4 4';
                }

                return (
                  <g
                    key={`unit-${i}`}
                    id={`unit-${i}`}
                    className={`transition-all duration-300 ${isInteractiveTapActive ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => isInteractiveTapActive && onUnitTap && onUnitTap(i)}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={UNIT_WIDTH}
                      height={UNIT_HEIGHT}
                      rx={blockRx}
                      fill={fill}
                      stroke={isSelected ? '#26B7FF' : stroke}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      strokeDasharray={strokeDash}
                      opacity={opacity}
                    />
                    <text
                      x={x + UNIT_WIDTH / 2}
                      y={y + textOffsetY}
                      fill={stroke}
                      fontSize={blockFontSize}
                      fontWeight="700"
                      textAnchor="middle"
                      opacity={opacity}
                      className="select-none"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Subtraction removal arrow (← take away) */}
              {currentStep.removedUnitsCount && currentStep.removedUnitsCount > 0 && (
                <g id="take-away-arrow-indicator" className="transition-all duration-300">
                  <path
                    d={`M ${getUnitX(modelConfig.baseCount || 8)} ${ROW1_Y - 16} L ${getUnitX((modelConfig.baseCount || 8) - currentStep.removedUnitsCount)} ${ROW1_Y - 16}`}
                    stroke="#666666"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrow-head)"
                  />
                  <defs>
                    <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M 6 0 L 0 3 L 6 6 z" fill="#666666" />
                    </marker>
                  </defs>
                  <text
                    x={(getUnitX(modelConfig.baseCount || 8) + getUnitX((modelConfig.baseCount || 8) - currentStep.removedUnitsCount)) / 2}
                    y={ROW1_Y - 26}
                    fill="#666666"
                    fontSize="13"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {language === 'ZH' ? `← 拿走 ${currentStep.removedUnitsCount} 块` : `← take away ${currentStep.removedUnitsCount}`}
                  </text>
                </g>
              )}

              {/* Bracket for Single Row Total */}
              {currentStep.bracketLabelEN && (
                renderBracket(
                  PADDING_LEFT,
                  getUnitX((currentStep.visibleUnitsCount ?? (modelConfig.baseCount || 0)) + (currentStep.addedUnitsCount || 0) - 1) + UNIT_WIDTH,
                  ROW1_Y + UNIT_HEIGHT + 14,
                  language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                  'bottom',
                  '#333333'
                )
              )}
            </g>
          )}

          {/* SINGLE ROW PARTITION (PART & WHOLE) & MISSING PART ROW */}
          {(modelType === 'single_row_partition' || modelType === 'missing_part_row') && (
            <g id="single-row-partition-group">
              {Array.from({ length: maxUnits }).map((_, i) => {
                const x = getUnitX(i);
                const y = ROW1_Y;
                const blueCount = currentStep.row1BlueCount ?? 0;
                const yellowCount = currentStep.row1YellowCount ?? 0;
                const missingCount = currentStep.missingPartCount ?? 0;
                const missingStart = currentStep.missingPartStartIndex !== undefined
                  ? currentStep.missingPartStartIndex
                  : (blueCount + yellowCount);

                let fill = '#FFFFFF';
                let stroke = '#D1D5DB';
                let textColor = '#666666';
                let strokeDash = 'none';
                let unitText = String(i + 1);

                if (i < blueCount) {
                  fill = '#26B7FF'; // Solid brand blue for first known part
                  stroke = '#26B7FF';
                  textColor = '#FFFFFF';
                } else if (i >= blueCount && i < blueCount + yellowCount) {
                  fill = '#FDE700'; // Accent yellow for second known part
                  stroke = '#333333';
                  textColor = '#333333';
                } else if (missingCount > 0 && i >= missingStart && i < missingStart + missingCount) {
                  fill = '#FEFCE8'; // Amber tint for missing/unknown part
                  stroke = '#EAB308';
                  strokeDash = '4 4';
                  textColor = '#CA8A04';
                  unitText = '?';
                }

                const isSelected = selectedUnits.includes(i);

                return (
                  <g
                    key={`part-unit-${i}`}
                    id={`part-unit-${i}`}
                    className={`transition-all duration-300 ${isInteractiveTapActive ? 'cursor-pointer hover:opacity-85' : ''}`}
                    onClick={() => isInteractiveTapActive && onUnitTap && onUnitTap(i)}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={UNIT_WIDTH}
                      height={UNIT_HEIGHT}
                      rx={blockRx}
                      fill={fill}
                      stroke={isSelected ? '#26B7FF' : stroke}
                      strokeWidth={isSelected ? '3.5' : (strokeDash !== 'none' ? '2' : '1.5')}
                      strokeDasharray={strokeDash}
                    />
                    <text
                      x={x + UNIT_WIDTH / 2}
                      y={y + textOffsetY}
                      fill={textColor}
                      fontSize={unitText === '?' ? (UNIT_WIDTH < 25 ? '12' : UNIT_WIDTH < 35 ? '14' : '17') : blockFontSize}
                      fontWeight="800"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {unitText}
                    </text>
                  </g>
                );
              })}

              {/* Primary Top Bracket (e.g., Known Part or Monday) */}
              {currentStep.topBracketLabelEN ? (
                (() => {
                  const tStart = currentStep.topBracketStartIndex !== undefined
                    ? currentStep.topBracketStartIndex
                    : 0;
                  const tEnd = currentStep.topBracketEndIndex !== undefined
                    ? currentStep.topBracketEndIndex
                    : ((currentStep.row1BlueCount ?? 1) - 1);
                  return renderBracket(
                    getUnitX(tStart),
                    getUnitX(tEnd) + UNIT_WIDTH,
                    ROW1_Y - 14,
                    language === 'ZH' ? currentStep.topBracketLabelZH || currentStep.topBracketLabelEN : currentStep.topBracketLabelEN,
                    'top',
                    '#26B7FF'
                  );
                })()
              ) : (
                currentStep.row1BlueCount && currentStep.row1BlueCount > 0 ? (
                  renderBracket(
                    PADDING_LEFT,
                    getUnitX(currentStep.row1BlueCount - 1) + UNIT_WIDTH,
                    ROW1_Y - 14,
                    language === 'ZH'
                      ? `已知: ${currentStep.row1BlueCount} ${modelConfig.unitNameZH || '单位'}`
                      : `Known: ${currentStep.row1BlueCount} ${modelConfig.unitNameEN || 'units'}`,
                    'top',
                    '#26B7FF'
                  )
                ) : null
              )}

              {/* Secondary Top Bracket (e.g., Tuesday or Missing/Unread) */}
              {currentStep.topBracket2LabelEN ? (
                (() => {
                  const t2Start = currentStep.topBracket2StartIndex !== undefined
                    ? currentStep.topBracket2StartIndex
                    : (currentStep.row1BlueCount ?? 0);
                  const t2End = currentStep.topBracket2EndIndex !== undefined
                    ? currentStep.topBracket2EndIndex
                    : ((currentStep.row1BlueCount ?? 0) + (currentStep.row1YellowCount ?? 1) - 1);
                  return renderBracket(
                    getUnitX(t2Start),
                    getUnitX(t2End) + UNIT_WIDTH,
                    ROW1_Y - 14,
                    language === 'ZH' ? currentStep.topBracket2LabelZH || currentStep.topBracket2LabelEN : currentStep.topBracket2LabelEN,
                    'top',
                    '#D97706'
                  );
                })()
              ) : (
                currentStep.missingPartCount && currentStep.missingPartCount > 0 ? (
                  renderBracket(
                    getUnitX(currentStep.row1BlueCount || 0),
                    getUnitX((currentStep.row1BlueCount || 0) + currentStep.missingPartCount - 1) + UNIT_WIDTH,
                    ROW1_Y - 14,
                    language === 'ZH'
                      ? `未知: ? ${modelConfig.unitNameZH || '单位'}`
                      : `Missing: ? ${modelConfig.unitNameEN || 'units'}`,
                    'top',
                    '#D97706'
                  )
                ) : !currentStep.missingPartCount && currentStep.row1YellowCount && currentStep.row1YellowCount > 0 ? (
                  renderBracket(
                    getUnitX(currentStep.row1BlueCount || 0),
                    getUnitX((currentStep.row1BlueCount || 0) + currentStep.row1YellowCount - 1) + UNIT_WIDTH,
                    ROW1_Y - 14,
                    language === 'ZH' ? `${currentStep.row1YellowCount} 块黄色` : `${currentStep.row1YellowCount} Yellow`,
                    'top',
                    '#D97706'
                  )
                ) : null
              )}

              {/* Bottom Bracket for Whole or Read Portion */}
              {currentStep.bracketLabelEN && (() => {
                const bStart = currentStep.bracketStartIndex !== undefined ? currentStep.bracketStartIndex : 0;
                const bEnd = currentStep.bracketEndIndex !== undefined ? currentStep.bracketEndIndex : (maxUnits - 1);
                return renderBracket(
                  getUnitX(bStart),
                  getUnitX(bEnd) + UNIT_WIDTH,
                  ROW1_Y + UNIT_HEIGHT + 14,
                  language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                  'bottom',
                  '#333333'
                );
              })()}
            </g>
          )}

          {/* TWO-ROW COMPARISON (MORE THAN / FEWER THAN) & SAME AND DIFFERENT (INVARIANCE) */}
          {(modelType === 'comparison_two_rows' || modelType === 'same_and_different') && (
            <g id="two-row-comparison-group">
              {/* Row 1 (Top) */}
              {Array.from({ length: (currentStep.row1Units ?? (modelConfig.totalUnitsRow1 || 0)) + (currentStep.row1Add ?? 0) }).map((_, i) => {
                const x = getUnitX(i);
                const y = ROW1_Y;
                const isExtra = i >= (currentStep.row1Units ?? (modelConfig.totalUnitsRow1 || 0));
                const deltaLabel = modelConfig.deltaCount ? `+${modelConfig.deltaCount}` : (currentStep.row1Add ? `+${currentStep.row1Add}` : '+3');
                return (
                  <g key={`row1-unit-${i}`} id={`row1-unit-${i}`} className="transition-all duration-300">
                    <rect
                      x={x}
                      y={y}
                      width={UNIT_WIDTH}
                      height={UNIT_HEIGHT}
                      rx={blockRx}
                      fill={isExtra ? '#FDE700' : '#FFFFFF'}
                      stroke={currentStep.highlightSame && isExtra ? '#26B7FF' : '#333333'}
                      strokeWidth={currentStep.highlightSame && isExtra ? '3.5' : '2'}
                    />
                    <text
                      x={x + UNIT_WIDTH / 2}
                      y={y + textOffsetY}
                      fill="#333333"
                      fontSize={blockFontSize}
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {isExtra && modelType === 'same_and_different' ? deltaLabel : i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Row 2 (Bottom) */}
              {(() => {
                const r2Count = currentStep.row2Units !== undefined ? currentStep.row2Units : (modelConfig.totalUnitsRow2 || 0);
                const r2Ghost = currentStep.row2GhostUnits || 0;
                const r2Total = r2Count + (currentStep.row2Add ?? 0) + r2Ghost;
                if (r2Total <= 0) return null;
                return Array.from({ length: r2Total }).map((_, i) => {
                  const x = getUnitX(i);
                  const y = ROW2_Y;
                  const isGhost = i >= r2Count + (currentStep.row2Add ?? 0);
                  const isExtra = !isGhost && i >= r2Count;
                  const isRemoved = currentStep.row2Remove && i >= r2Count - currentStep.row2Remove;
                  const deltaLabel = modelConfig.deltaCount ? `+${modelConfig.deltaCount}` : (currentStep.row2Add ? `+${currentStep.row2Add}` : '+3');

                  let fill = '#FFFFFF';
                  let stroke = '#333333';
                  let strokeDash = 'none';
                  let opacity = 1;

                  if (isGhost) {
                    fill = '#F6F6F6';
                    stroke = '#999999';
                    strokeDash = '4 4';
                    opacity = 0.6;
                  } else if (isExtra) {
                    fill = '#FDE700'; // Extra items in yellow
                    stroke = currentStep.highlightSame ? '#26B7FF' : '#333333';
                  } else if (isRemoved) {
                    fill = '#F6F6F6';
                    stroke = '#999999';
                    strokeDash = '4 4';
                    opacity = 0.4;
                  }

                  const isSelected = selectedUnits.includes(i);

                  return (
                    <g
                      key={`row2-unit-${i}`}
                      id={`row2-unit-${i}`}
                      className={`transition-all duration-300 ${isInteractiveTapActive ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={() => isInteractiveTapActive && onUnitTap && onUnitTap(i)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={UNIT_WIDTH}
                        height={UNIT_HEIGHT}
                        rx={blockRx}
                        fill={fill}
                        stroke={isSelected ? '#26B7FF' : (currentStep.highlightSame && isExtra ? '#26B7FF' : stroke)}
                        strokeWidth={isSelected || (currentStep.highlightSame && isExtra) ? '3.5' : '2'}
                        strokeDasharray={strokeDash}
                        opacity={opacity}
                      />
                      <text
                        x={x + UNIT_WIDTH / 2}
                        y={y + textOffsetY}
                        fill={stroke}
                        fontSize={blockFontSize}
                        fontWeight="700"
                        textAnchor="middle"
                        opacity={opacity}
                      >
                        {isGhost ? '?' : (isExtra && modelType === 'same_and_different' ? deltaLabel : i + 1)}
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Difference alignment guide line */}
              {currentStep.highlightDifference && (
                <g id="diff-guideline" className="transition-all duration-300">
                  <line
                    x1={getUnitX(modelConfig.totalUnitsRow1 || 7)}
                    y1={ROW1_Y - 10}
                    x2={getUnitX(modelConfig.totalUnitsRow1 || 7)}
                    y2={ROW2_Y + UNIT_HEIGHT + 10}
                    stroke="#26B7FF"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  <text
                    x={getUnitX(modelConfig.totalUnitsRow1 || 7) + 6}
                    y={ROW1_Y + UNIT_HEIGHT + 35}
                    fill="#26B7FF"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {language === 'ZH' ? '分界线' : 'Align Line'}
                  </text>
                </g>
              )}

              {/* Row 1 Bracket */}
              {currentStep.topBracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.topBracketStartIndex ?? 0),
                  getUnitX(currentStep.topBracketEndIndex ?? ((currentStep.row1Units ?? (modelConfig.totalUnitsRow1 || 0)) - 1)) + UNIT_WIDTH,
                  ROW1_Y - 14,
                  language === 'ZH' ? currentStep.topBracketLabelZH || currentStep.topBracketLabelEN : currentStep.topBracketLabelEN,
                  'top',
                  '#26B7FF'
                )
              )}

              {/* Row 2 Bracket */}
              {currentStep.bracketLabelEN && (() => {
                const r2Count = currentStep.row2Units !== undefined ? currentStep.row2Units : (modelConfig.totalUnitsRow2 || 0);
                const bEnd = currentStep.bracketEndIndex !== undefined
                  ? currentStep.bracketEndIndex
                  : (r2Count + (currentStep.row2Add ?? 0) - 1);
                return renderBracket(
                  getUnitX(currentStep.bracketStartIndex ?? 0),
                  getUnitX(Math.max(0, bEnd)) + UNIT_WIDTH,
                  ROW2_Y + UNIT_HEIGHT + 14,
                  language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                  'bottom',
                  '#333333'
                );
              })()}
            </g>
          )}

          {/* UNIT SCALE (FIND ONE FIRST) */}
          {modelType === 'unit_scale' && (
            <g id="unit-scale-group">
              {Array.from({ length: (currentStep.row1Units ?? 0) + (currentStep.row1Add ?? 0) }).map((_, i) => {
                const x = getUnitX(i);
                const y = ROW1_Y;
                const isExtended = i >= (currentStep.row1Units ?? 0);
                const isIsolated = currentStep.isolatedUnitIndex === i;
                const fill = isExtended ? '#FDE700' : (isIsolated ? '#FEF08A' : '#FFFFFF');
                const stroke = isIsolated ? '#26B7FF' : '#333333';
                const strokeWidth = isIsolated ? '3.5' : '2';

                let displayText = '';
                if (currentStep.highlightUnitRate) {
                  if (isIsolated) {
                    displayText = currentStep.row1UnitValue !== undefined && currentStep.row1UnitValue !== '' ? String(currentStep.row1UnitValue) : '?';
                  }
                } else if (currentStep.row1UnitValue !== undefined && currentStep.row1UnitValue !== '') {
                  displayText = String(currentStep.row1UnitValue);
                }

                return (
                  <g key={`unit-scale-${i}`} id={`unit-scale-${i}`} className="transition-all duration-300">
                    <rect
                      x={x}
                      y={y}
                      width={UNIT_WIDTH}
                      height={UNIT_HEIGHT}
                      rx={blockRx}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                    {displayText && (
                      <text
                        x={x + UNIT_WIDTH / 2}
                        y={y + textOffsetY}
                        fill={displayText === '?' ? '#26B7FF' : '#333333'}
                        fontSize={displayText === '?' ? (UNIT_WIDTH < 25 ? '12' : UNIT_WIDTH < 35 ? '14' : '17') : blockFontSize}
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {displayText}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Unit Bracket */}
              {currentStep.bracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.bracketStartIndex ?? 0),
                  getUnitX(currentStep.bracketEndIndex ?? ((currentStep.row1Units ?? 0) + (currentStep.row1Add ?? 0) - 1)) + UNIT_WIDTH,
                  ROW1_Y + UNIT_HEIGHT + 14,
                  language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                  currentStep.bracketPosition || 'bottom',
                  '#333333'
                )
              )}

              {/* Optional Top Bracket (e.g., for 1 unit = ? or 1 unit = 5) */}
              {currentStep.topBracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.topBracketStartIndex ?? (currentStep.isolatedUnitIndex ?? 0)),
                  getUnitX(currentStep.topBracketEndIndex ?? (currentStep.isolatedUnitIndex ?? 0)) + UNIT_WIDTH,
                  ROW1_Y - 14,
                  language === 'ZH' ? currentStep.topBracketLabelZH || currentStep.topBracketLabelEN : currentStep.topBracketLabelEN,
                  'top',
                  '#26B7FF'
                )
              )}
            </g>
          )}

          {/* RATIO ROWS (HIDDEN UNIT EXPLORER) */}
          {modelType === 'ratio_rows' && (() => {
            const r1Fill = modelConfig.row1Color || '#26B7FF';
            const r2Fill = modelConfig.row2Color || '#FDE700';
            const r1Text = (r1Fill === '#FDE700' || r1Fill === '#FEF08A') ? '#333333' : '#FFFFFF';
            const r2Text = (r2Fill === '#26B7FF' || r2Fill === '#0284C7') ? '#FFFFFF' : '#333333';
            const r1Stroke = (r1Fill === '#FDE700') ? '#CA8A04' : '#0284C7';
            const r2Stroke = (r2Fill === '#26B7FF') ? '#0284C7' : '#CA8A04';

            return (
              <g id="ratio-rows-group">
                {/* Row 1 units */}
                {Array.from({ length: currentStep.row1Units ?? 0 }).map((_, i) => {
                  const x = getUnitX(i);
                  const y = ROW1_Y;
                  const isIsolated = currentStep.isolatedUnitIndex === i;
                  const stroke = isIsolated ? '#333333' : r1Stroke;
                  const strokeWidth = isIsolated ? '3.5' : '2';

                  return (
                    <g key={`ratio-r1-${i}`} id={`ratio-r1-${i}`} className="transition-all duration-300">
                      <rect
                        x={x}
                        y={y}
                        width={UNIT_WIDTH}
                        height={UNIT_HEIGHT}
                        rx={blockRx}
                        fill={r1Fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                      />
                      {currentStep.row1UnitValue !== undefined && currentStep.row1UnitValue !== '' && (
                        <text
                          x={x + UNIT_WIDTH / 2}
                          y={y + textOffsetY}
                          fill={r1Text}
                          fontSize={blockFontSize}
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {String(currentStep.row1UnitValue)}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Row 2 units */}
                {Array.from({ length: currentStep.row2Units ?? 0 }).map((_, i) => {
                  const x = getUnitX(i);
                  const y = ROW2_Y;
                  const isOverhang = i >= (currentStep.row1Units ?? 0);
                  const isIsolated = currentStep.isolatedUnitIndex === i;

                  let stroke = isOverhang && currentStep.highlightDifference ? '#333333' : r2Stroke;
                  let strokeWidth = isOverhang && currentStep.highlightDifference ? '3.5' : '2';
                  if (isIsolated) {
                    stroke = '#26B7FF';
                    strokeWidth = '3.5';
                  }

                  return (
                    <g key={`ratio-r2-${i}`} id={`ratio-r2-${i}`} className="transition-all duration-300">
                      <rect
                        x={x}
                        y={y}
                        width={UNIT_WIDTH}
                        height={UNIT_HEIGHT}
                        rx={blockRx}
                        fill={r2Fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                      />
                      {currentStep.row2UnitValue !== undefined && currentStep.row2UnitValue !== '' && (
                        <text
                          x={x + UNIT_WIDTH / 2}
                          y={y + textOffsetY}
                          fill={r2Text}
                          fontSize={blockFontSize}
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {String(currentStep.row2UnitValue)}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Highlight the overhang difference units */}
                {currentStep.highlightDifference && (currentStep.row2Units ?? 0) > (currentStep.row1Units ?? 0) ? (
                  renderBracket(
                    getUnitX(currentStep.row1Units ?? 0),
                    getUnitX((currentStep.row2Units ?? 0) - 1) + UNIT_WIDTH,
                    ROW2_Y + UNIT_HEIGHT + 14,
                    language === 'ZH'
                      ? currentStep.bracketLabelZH || `${(currentStep.row2Units ?? 0) - (currentStep.row1Units ?? 0)} 份差量`
                      : currentStep.bracketLabelEN || `${(currentStep.row2Units ?? 0) - (currentStep.row1Units ?? 0)} extra units`,
                    'bottom',
                    '#333333'
                  )
                ) : (
                  currentStep.bracketLabelEN && (
                    renderBracket(
                      PADDING_LEFT,
                      getUnitX(Math.max(currentStep.row1Units ?? 0, currentStep.row2Units ?? 0) - 1) + UNIT_WIDTH,
                      ROW2_Y + UNIT_HEIGHT + 14,
                      language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                      'bottom',
                      '#333333'
                    )
                  )
                )}
              </g>
            );
          })()}

          {/* PERCENT BAR (100% PARTITION) */}
          {modelType === 'percent_bar' && (
            <g id="percent-bar-group">
              {Array.from({ length: maxUnits }).map((_, i) => {
                const x = getUnitX(i);
                const y = ROW1_Y;
                const isDiscounted = currentStep.row1Remove && i >= maxUnits - currentStep.row1Remove;
                const percentPerUnit = 100 / maxUnits;

                return (
                  <g key={`pct-unit-${i}`} id={`pct-unit-${i}`} className="transition-all duration-300">
                    <rect
                      x={x}
                      y={y}
                      width={UNIT_WIDTH}
                      height={UNIT_HEIGHT}
                      rx="10"
                      fill={isDiscounted ? '#F3F4F6' : '#26B7FF'}
                      stroke={isDiscounted ? '#9CA3AF' : '#26B7FF'}
                      strokeWidth="2"
                      strokeDasharray={isDiscounted ? '4 4' : 'none'}
                      opacity={isDiscounted ? 0.45 : 1}
                    />
                    {isDiscounted && (
                      <line
                        x1={x + 4}
                        y1={y + 4}
                        x2={x + UNIT_WIDTH - 4}
                        y2={y + UNIT_HEIGHT - 4}
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                        opacity={0.6}
                      />
                    )}
                    <text
                      x={x + UNIT_WIDTH / 2}
                      y={y + UNIT_HEIGHT / 2 + 6}
                      fill={isDiscounted ? '#6B7280' : '#FFFFFF'}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {currentStep.row1UnitValue && !isDiscounted
                        ? String(currentStep.row1UnitValue)
                        : `${percentPerUnit}%`}
                    </text>
                  </g>
                );
              })}

              {/* Top Bracket for Percent Bar (e.g. Discount/Saved portion) */}
              {currentStep.topBracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.topBracketStartIndex ?? (currentStep.row1Remove ? maxUnits - currentStep.row1Remove : 0)),
                  getUnitX(currentStep.topBracketEndIndex ?? (maxUnits - 1)) + UNIT_WIDTH,
                  ROW1_Y - 14,
                  language === 'ZH' ? currentStep.topBracketLabelZH || currentStep.topBracketLabelEN : currentStep.topBracketLabelEN,
                  'top',
                  '#DC2626'
                )
              )}

              {/* Bottom Bracket for Percent Bar (e.g. Total 100% or Remaining Price) */}
              {currentStep.bracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.bracketStartIndex ?? 0),
                  getUnitX(currentStep.bracketEndIndex ?? (maxUnits - 1)) + UNIT_WIDTH,
                  ROW1_Y + UNIT_HEIGHT + 14,
                  language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                  currentStep.bracketPosition || 'bottom',
                  '#333333'
                )
              )}
            </g>
          )}

          {/* SYSTEM ELIMINATION (RELATIONSHIP SOLVER) */}
          {modelType === 'system_elimination' && (() => {
            interface EliminationToken {
              id: string;
              type: 'item1' | 'item2';
              label: string;
              icon: string;
              isCommon: boolean;
            }

            const item1NameEN = modelConfig.item1LabelEN || (modelConfig.unitNameEN === 'ticket' ? 'Adult' : 'Item A');
            const item1NameZH = modelConfig.item1LabelZH || (modelConfig.unitNameEN === 'ticket' ? '成人' : '项目A');
            const item2NameEN = modelConfig.item2LabelEN || (modelConfig.unitNameEN === 'ticket' ? 'Child' : 'Item B');
            const item2NameZH = modelConfig.item2LabelZH || (modelConfig.unitNameEN === 'ticket' ? '儿童' : '项目B');

            const item1Label = language === 'ZH' ? item1NameZH : item1NameEN;
            const item2Label = language === 'ZH' ? item2NameZH : item2NameEN;

            const getItemIcon = (name: string) => {
              const lower = name.toLowerCase();
              if (lower.includes('shirt') || lower.includes('衬衫')) return '👕';
              if (lower.includes('hat') || lower.includes('帽子')) return '🧢';
              if (lower.includes('pen') || lower.includes('钢笔')) return '✏️';
              if (lower.includes('notebook') || lower.includes('笔记本')) return '📓';
              if (lower.includes('eraser') || lower.includes('橡皮')) return '🧼';
              if (lower.includes('pencil') || lower.includes('铅笔')) return '✏️';
              if (lower.includes('adult') || lower.includes('成人') || lower.includes('child') || lower.includes('儿童') || lower.includes('ticket')) return '🎟️';
              return '📦';
            };

            const icon1 = getItemIcon(item1NameEN + ' ' + item1NameZH);
            const icon2 = getItemIcon(item2NameEN + ' ' + item2NameZH);

            const c1A = modelConfig.item1CountRow1 ?? 2;
            const c1B = modelConfig.item1CountRow2 ?? 2;
            const totalA = modelConfig.totalUnitsRow1 ?? maxUnits;
            const totalB = currentStep.row2Units !== undefined ? currentStep.row2Units : (modelConfig.totalUnitsRow2 ?? 3);
            const c2A = totalA - c1A;
            const c2B = totalB - c1B;

            // 1. Compute common multiset
            const commonItem1 = Math.min(c1A, c1B);
            const commonItem2 = Math.min(c2A, c2B);

            // 2. Compute remainders
            const remItem1A = c1A - commonItem1;
            const remItem2A = c2A - commonItem2;
            const remItem1B = c1B - commonItem1;
            const remItem2B = c2B - commonItem2;

            const createToken = (id: string, type: 'item1' | 'item2', isCommon: boolean): EliminationToken => ({
              id,
              type,
              label: type === 'item1' ? item1Label : item2Label,
              icon: type === 'item1' ? icon1 : icon2,
              isCommon,
            });

            // Common items aligned first in both rows
            const commonRowA: EliminationToken[] = [];
            const commonRowB: EliminationToken[] = [];
            for (let i = 0; i < commonItem1; i++) {
              commonRowA.push(createToken(`r1-c-it1-${i}`, 'item1', true));
              commonRowB.push(createToken(`r2-c-it1-${i}`, 'item1', true));
            }
            for (let i = 0; i < commonItem2; i++) {
              commonRowA.push(createToken(`r1-c-it2-${i}`, 'item2', true));
              commonRowB.push(createToken(`r2-c-it2-${i}`, 'item2', true));
            }

            // Remainder tokens
            const remRowA: EliminationToken[] = [];
            for (let i = 0; i < remItem1A; i++) {
              remRowA.push(createToken(`r1-rem-it1-${i}`, 'item1', false));
            }
            for (let i = 0; i < remItem2A; i++) {
              remRowA.push(createToken(`r1-rem-it2-${i}`, 'item2', false));
            }

            const remRowB: EliminationToken[] = [];
            for (let i = 0; i < remItem1B; i++) {
              remRowB.push(createToken(`r2-rem-it1-${i}`, 'item1', false));
            }
            for (let i = 0; i < remItem2B; i++) {
              remRowB.push(createToken(`r2-rem-it2-${i}`, 'item2', false));
            }

            const row1Tokens: EliminationToken[] = [...commonRowA, ...remRowA];
            const row2Tokens: EliminationToken[] = [...commonRowB, ...remRowB];

            const commonCount = commonItem1 + commonItem2;

            return (
              <g id="system-elimination-group">
                {/* Fixed Left Label Column: Row 1 Label */}
                {modelConfig.row1LabelEN && (
                  <text
                    x={PADDING_LEFT - 16}
                    y={ROW1_Y + UNIT_HEIGHT / 2 + 5}
                    fill="#1E293B"
                    fontSize="14"
                    fontWeight="800"
                    textAnchor="end"
                  >
                    {language === 'ZH' ? modelConfig.row1LabelZH || modelConfig.row1LabelEN : modelConfig.row1LabelEN}
                  </text>
                )}

                {/* Row 1 Units */}
                {row1Tokens.map((token, i) => {
                  const x = getUnitX(i);
                  const y = ROW1_Y;
                  const isFaded = Boolean(currentStep.eliminatedRow1Common && token.isCommon);
                  const isHighlightedCommon = Boolean(currentStep.highlightSame && token.isCommon);

                  // Display value priority: unit value when solved, else icon + label
                  let displayLabel = `${token.icon} ${token.label}`;
                  if (!isFaded && currentStep.row1UnitValue && !token.isCommon) {
                    displayLabel = `${token.icon} ${currentStep.row1UnitValue}`;
                  } else if (!isFaded && currentStep.row1UnitValue && token.type === 'item1') {
                    displayLabel = `${token.icon} ${currentStep.row1UnitValue}`;
                  } else if (!isFaded && currentStep.row2UnitValue && token.type === 'item2') {
                    displayLabel = `${token.icon} ${currentStep.row2UnitValue}`;
                  }

                  const fillColor = isFaded
                    ? '#F8FAFC'
                    : token.type === 'item1'
                    ? '#26B7FF'
                    : '#FDE700';

                  const strokeColor = isHighlightedCommon
                    ? '#26B7FF'
                    : isFaded
                    ? '#CBD5E1'
                    : token.type === 'item1'
                    ? '#0284C7'
                    : '#CA8A04';

                  const textColor = isFaded
                    ? '#94A3B8'
                    : token.type === 'item1'
                    ? '#FFFFFF'
                    : '#333333';

                  return (
                    <g key={token.id} id={token.id} className="transition-all duration-300">
                      <rect
                        x={x}
                        y={y}
                        width={UNIT_WIDTH}
                        height={UNIT_HEIGHT}
                        rx={blockRx}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isHighlightedCommon ? '3.5' : '2'}
                        strokeDasharray={isFaded ? '5 4' : 'none'}
                        opacity={isFaded ? 0.45 : 1}
                      />
                      {isFaded && (
                        <line
                          x1={x + 6}
                          y1={y + 6}
                          x2={x + UNIT_WIDTH - 6}
                          y2={y + UNIT_HEIGHT - 6}
                          stroke="#EF4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity={0.7}
                        />
                      )}
                      <text
                        x={x + UNIT_WIDTH / 2}
                        y={y + textOffsetY}
                        fill={textColor}
                        fontSize={blockFontSize}
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {displayLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Row 1 Total Value */}
                {modelConfig.totalValueRow1 && (
                  <text
                    x={getUnitX(row1Tokens.length - 1) + UNIT_WIDTH + 24}
                    y={ROW1_Y + UNIT_HEIGHT / 2 + 6}
                    fill="#1E293B"
                    fontSize="18"
                    fontWeight="800"
                  >
                    {modelConfig.totalValueRow1}
                  </text>
                )}

                {/* Fixed Left Label Column: Row 2 Label */}
                {row2Tokens.length > 0 && modelConfig.row2LabelEN && (
                  <text
                    x={PADDING_LEFT - 16}
                    y={ROW2_Y + UNIT_HEIGHT / 2 + 5}
                    fill="#1E293B"
                    fontSize="14"
                    fontWeight="800"
                    textAnchor="end"
                  >
                    {language === 'ZH' ? modelConfig.row2LabelZH || modelConfig.row2LabelEN : modelConfig.row2LabelEN}
                  </text>
                )}

                {/* Row 2 Units */}
                {row2Tokens.map((token, i) => {
                  const x = getUnitX(i);
                  const y = ROW2_Y;
                  const isFaded = Boolean(currentStep.eliminatedRow2Common && token.isCommon);
                  const isHighlightedCommon = Boolean(currentStep.highlightSame && token.isCommon);

                  // Display value priority: unit values when solved, else icon + label
                  let displayLabel = `${token.icon} ${token.label}`;
                  if (!isFaded && token.type === 'item1' && currentStep.row1UnitValue) {
                    displayLabel = `${token.icon} ${currentStep.row1UnitValue}`;
                  } else if (!isFaded && token.type === 'item2' && currentStep.row2UnitValue) {
                    displayLabel = `${token.icon} ${currentStep.row2UnitValue}`;
                  }

                  const fillColor = isFaded
                    ? '#F8FAFC'
                    : token.type === 'item1'
                    ? '#26B7FF'
                    : '#FDE700';

                  const strokeColor = isHighlightedCommon
                    ? '#26B7FF'
                    : isFaded
                    ? '#CBD5E1'
                    : token.type === 'item1'
                    ? '#0284C7'
                    : '#CA8A04';

                  const textColor = isFaded
                    ? '#94A3B8'
                    : token.type === 'item1'
                    ? '#FFFFFF'
                    : '#333333';

                  return (
                    <g key={token.id} id={token.id} className="transition-all duration-300">
                      <rect
                        x={x}
                        y={y}
                        width={UNIT_WIDTH}
                        height={UNIT_HEIGHT}
                        rx={blockRx}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isHighlightedCommon ? '3.5' : '2'}
                        strokeDasharray={isFaded ? '5 4' : 'none'}
                        opacity={isFaded ? 0.45 : 1}
                      />
                      {isFaded && (
                        <line
                          x1={x + 6}
                          y1={y + 6}
                          x2={x + UNIT_WIDTH - 6}
                          y2={y + UNIT_HEIGHT - 6}
                          stroke="#EF4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity={0.7}
                        />
                      )}
                      <text
                        x={x + UNIT_WIDTH / 2}
                        y={y + textOffsetY}
                        fill={textColor}
                        fontSize={blockFontSize}
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {displayLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Row 2 Total Value */}
                {row2Tokens.length > 0 && modelConfig.totalValueRow2 && (
                  <text
                    x={getUnitX(row2Tokens.length - 1) + UNIT_WIDTH + 24}
                    y={ROW2_Y + UNIT_HEIGHT / 2 + 6}
                    fill="#1E293B"
                    fontSize="18"
                    fontWeight="800"
                  >
                    {modelConfig.totalValueRow2}
                  </text>
                )}

                {/* Elimination Bracket - Positioned on Row 1 or Row 2 */}
                {currentStep.bracketLabelEN && (() => {
                  const targetRow = currentStep.bracketRow || 1;
                  const targetTokens = targetRow === 1 ? row1Tokens : row2Tokens;
                  const startIdx = currentStep.bracketStartIndex !== undefined ? currentStep.bracketStartIndex : commonCount;
                  const endIdx = currentStep.bracketEndIndex !== undefined ? currentStep.bracketEndIndex : (targetTokens.length - 1);
                  const bracketPos = currentStep.bracketPosition || (targetRow === 2 ? 'bottom' : 'top');
                  const rowY = targetRow === 1 ? ROW1_Y : ROW2_Y;
                  const bracketY = bracketPos === 'bottom' ? rowY + UNIT_HEIGHT + 14 : rowY - 14;
                  const bracketColor = targetRow === 2 ? '#CA8A04' : '#0284C7';

                  return renderBracket(
                    getUnitX(startIdx),
                    getUnitX(endIdx) + UNIT_WIDTH,
                    bracketY,
                    language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                    bracketPos,
                    bracketColor
                  );
                })()}
              </g>
            );
          })()}

          {/* REBUILD WHOLE MODEL (REVERSE FRACTION DEDUCTION) */}
          {modelType === 'rebuild_whole' && (
            <g id="rebuild-whole-group">
              {Array.from({ length: maxUnits }).map((_, i) => {
                const x = getUnitX(i);
                const y = ROW1_Y;
                const isSpent = currentStep.missingPartCount && i < currentStep.missingPartCount;
                const isVisible = i < (currentStep.visibleUnitsCount ?? maxUnits);

                let fill = '#26B7FF';
                let stroke = '#26B7FF';
                let strokeDash = 'none';
                let opacity = 1;
                let textColor = '#FFFFFF';
                let textVal = currentStep.row1UnitValue ? `$${currentStep.row1UnitValue}` : `1/${maxUnits}`;

                if (isSpent) {
                  fill = '#F6F6F6';
                  stroke = '#A3A3A3';
                  strokeDash = '4 4';
                  opacity = 0.45;
                  textColor = '#737373';
                  textVal = `${currentStep.missingPartCount}/${maxUnits} spent`;
                } else if (!isVisible) {
                  // Persistent canvas placeholder: keep the unit frame stable
                  fill = '#FAFAFA';
                  stroke = '#E5E7EB';
                  strokeDash = '3 3';
                  opacity = 0.6;
                  textColor = '#9CA3AF';
                  textVal = '?';
                }

                return (
                  <g key={`rebuild-unit-${i}`} id={`rebuild-unit-${i}`} className="transition-all duration-300">
                    <rect
                      x={x}
                      y={y}
                      width={UNIT_WIDTH}
                      height={UNIT_HEIGHT}
                      rx={blockRx}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={!isVisible ? '1.5' : '2'}
                      strokeDasharray={strokeDash}
                      opacity={opacity}
                    />
                    <text
                      x={x + UNIT_WIDTH / 2}
                      y={y + textOffsetY}
                      fill={textColor}
                      fontSize={textVal === '?' ? '16' : blockFontSize}
                      fontWeight="700"
                      textAnchor="middle"
                      opacity={opacity}
                    >
                      {textVal}
                    </text>
                  </g>
                );
              })}

              {/* Remainder / Known Bracket */}
              {currentStep.bracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.bracketStartIndex ?? (currentStep.missingPartCount || 0)),
                  getUnitX(currentStep.bracketEndIndex ?? ((currentStep.visibleUnitsCount ?? maxUnits) - 1)) + UNIT_WIDTH,
                  ROW1_Y + UNIT_HEIGHT + 14,
                  language === 'ZH' ? currentStep.bracketLabelZH || currentStep.bracketLabelEN : currentStep.bracketLabelEN,
                  currentStep.bracketPosition || 'bottom',
                  '#26B7FF'
                )
              )}

              {/* Optional Top Bracket for Rebuilt Whole */}
              {currentStep.topBracketLabelEN && (
                renderBracket(
                  getUnitX(currentStep.topBracketStartIndex ?? 0),
                  getUnitX(currentStep.topBracketEndIndex ?? (maxUnits - 1)) + UNIT_WIDTH,
                  ROW1_Y - 14,
                  language === 'ZH' ? currentStep.topBracketLabelZH || currentStep.topBracketLabelEN : currentStep.topBracketLabelEN,
                  'top',
                  '#333333'
                )
              )}
            </g>
          )}

          {/* SCALE MODEL 1: UNIT RATE (4 levels -> 12 stars -> 1 level = 3 -> 9 levels = 27) */}
          {modelType === 'scale_unit_rate' && (
            <ScaleUnitRateModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}

          {/* SCALE MODEL 2: RECIPE SCALING (1 recipe -> multiplier k -> k recipes) */}
          {modelType === 'recipe_scale' && (
            <RecipeScaleModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
            />
          )}

          {/* SCALE MODEL 3: PROPORTIONAL PAIRED QUANTITIES (2 smoothies <-> 4 strawberries) */}
          {modelType === 'proportional_pairs' && (
            <ProportionalPairsModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}

          {/* MIA CANDY REVERSE (Whole -> 1/2 to sister -> 4 to brother -> 6 left -> half=10 -> whole=20) */}
          {modelType === 'mia_candy_reverse' && (
            <MiaCandyReverseModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}

          {/* SOPHIA MONEY NESTED REMAINDER (4 quarters -> 1/4 books -> 1/3 of remaining game -> $40 left) */}
          {modelType === 'nested_fraction_remainder' && (
            <NestedFractionRemainderModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}

          {/* CARD TRANSFER INVARIANCE (Deck A & B sum 90 -> 15 transferred -> A is 2x B -> reverse) */}
          {modelType === 'card_transfer_invariance' && (
            <CardTransferInvarianceModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}

          {/* STICKER PACK SCALE (Pack of 5 glow + 3 glitter -> 25 glow -> 5 packs -> 15 glitter) */}
          {modelType === 'sticker_pack_scale' && (
            <StickerPackScaleModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}

          {/* SAM & ALEX CARD TRANSFER (Sam 14, Alex 6 -> Diff 8 -> Half 4 -> Travel -> 10 each -> Invariant 20) */}
          {modelType === 'sam_alex_card_transfer' && (
            <SamAlexCardTransferModel
              currentStep={currentStep}
              modelConfig={modelConfig}
              language={language}
              renderBracket={renderBracket}
            />
          )}
        </svg>
      </div>

      {/* Stage Bottom Formula Banner */}
      <div className="w-full shrink-0 flex items-center justify-between bg-gray-50/90 border border-gray-200/70 rounded-xl px-4 py-2 mt-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666666]">
          <span className="w-2 h-2 rounded-full bg-[#26B7FF] shrink-0" />
          <span className="truncate">
            {language === 'ZH'
              ? currentStep.statusNoteZH || currentStep.statusNoteEN || '数量关系清晰可见'
              : currentStep.statusNoteEN || 'Mathematical relationships visually aligned'}
          </span>
        </div>

        {currentStep.formulaEN && (
          <div className="text-sm sm:text-base font-bold text-[#333333] bg-[#FDE700]/30 border border-[#FDE700] px-3.5 py-1 rounded-lg tracking-wide shrink-0">
            {language === 'ZH' ? currentStep.formulaZH || currentStep.formulaEN : currentStep.formulaEN}
          </div>
        )}
      </div>
    </div>
  );
};
