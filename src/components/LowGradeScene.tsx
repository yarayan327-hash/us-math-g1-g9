import React from 'react';
import {
  FeedbackState,
  getProblemVisualConfig,
  ProblemVisualConfig
} from '../data/courseVisualConfig';

export function getLowGradeIntroScene(levelNumber: number, activityId: string): ProblemVisualConfig['intro'] | null {
  if (levelNumber < 1) return null;
  return getProblemVisualConfig(activityId)?.intro ?? null;
}

export function getLowGradeTeachingObject(
  levelNumber: number,
  activityId: string,
  stepIndex: number
): ProblemVisualConfig['teaching'] | null {
  if (levelNumber > 6) return null;
  if (stepIndex !== 0) return null;
  const teaching = getProblemVisualConfig(activityId)?.teaching ?? null;
  return teaching?.object ? teaching : null;
}

export function getLowGradeFeedbackAsset(
  levelNumber: number,
  activityId: string,
  state: FeedbackState | null
) {
  if (levelNumber > 3 || !state) return null;
  return getProblemVisualConfig(activityId)?.feedback[state] ?? null;
}

export const LowGradeIntroScene: React.FC<{ config: NonNullable<ProblemVisualConfig['intro']> }> = ({ config }) => (
  <div className={`vm-low-intro-scene vm-low-intro-scene--${config.preset}`} aria-hidden="true">
    <div className="vm-low-intro-scene__ground" />
    {config.character && (
      <img
        src={config.character.src}
        alt=""
        className="vm-low-intro-scene__character"
        draggable={false}
      />
    )}
    {config.object && (
      <img
        src={config.object.src}
        alt=""
        className="vm-low-intro-scene__object"
        draggable={false}
      />
    )}
    {config.supportingObject && (
      <img
        src={config.supportingObject.src}
        alt=""
        className="vm-low-intro-scene__support"
        draggable={false}
      />
    )}
    {config.objectFamily?.map((asset, index) => (
      <img
        key={`${asset.src}-${index}`}
        src={asset.src}
        alt=""
        className={`vm-low-intro-scene__family vm-low-intro-scene__family--${index + 1}`}
        draggable={false}
      />
    ))}
  </div>
);

export const LowGradeTeachingObject: React.FC<{ config: NonNullable<ProblemVisualConfig['teaching']> }> = ({ config }) => (
  <div className={`vm-low-teaching-object vm-low-teaching-object--${config.preset}`} aria-hidden="true">
    {config.object && <img src={config.object.src} alt="" draggable={false} />}
  </div>
);

export const CharacterFeedbackZone: React.FC<{ asset: { src: string; label: string }; state: FeedbackState }> = ({
  asset,
  state
}) => (
  <div className={`vm-character-feedback-zone vm-character-feedback-zone--${state}`} aria-hidden="true">
    <img src={asset.src} alt="" draggable={false} />
    {state === 'correct' && (
      <>
        <span className="vm-character-feedback-zone__star vm-character-feedback-zone__star--one" />
        <span className="vm-character-feedback-zone__star vm-character-feedback-zone__star--two" />
      </>
    )}
  </div>
);
