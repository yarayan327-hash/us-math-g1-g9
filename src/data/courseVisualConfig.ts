import { courseAssets } from './courseAssets';

export type VisualAgeBand = 'young' | 'middle' | 'senior';
export type IntroScenePreset = 'characterObjectRight' | 'characterOnlyRight' | 'objectOnlyRight' | 'objectGroupRight' | 'noAsset';
export type TeachingContextPreset = 'objectOnlyLowRight';
export type FeedbackState = 'thinking' | 'correct' | 'retry';

export type VisualAssetRef = {
  src: string;
  label: string;
};

export type ProblemVisualConfig = {
  ageBand: VisualAgeBand;
  intro: {
    character: VisualAssetRef | null;
    object: VisualAssetRef | null;
    supportingObject?: VisualAssetRef | null;
    objectFamily?: VisualAssetRef[];
    preset: IntroScenePreset;
  } | null;
  teaching: {
    object: VisualAssetRef | null;
    preset: TeachingContextPreset;
  } | null;
  feedback: Partial<Record<FeedbackState, VisualAssetRef>>;
  mappingReason: string;
};

const characterAssets = {
  avaThinking: { src: courseAssets.characters.ava, label: 'Ava approved character asset' },
  avaCorrect: { src: courseAssets.characters.ava, label: 'Ava approved character asset' },
  benThinking: { src: courseAssets.characters.ben, label: 'Ben approved character asset' },
  benCorrect: { src: courseAssets.characters.ben, label: 'Ben approved character asset' },
  blueBoyThinking: { src: courseAssets.characters.boyThinking, label: 'general blue boy thinking pose' },
  blueBoyPointing: { src: courseAssets.characters.boyPointing, label: 'general blue boy pointing pose' },
  blueBoyCorrect: { src: courseAssets.characters.boyCelebrating, label: 'general blue boy celebrating pose' }
} as const;

const objectAssets = {
  blueCrayon: { src: courseAssets.objects.crayonBlue, label: 'blue crayon' },
  yellowCrayon: { src: courseAssets.objects.crayonYellow, label: 'yellow crayon supporting accent' },
  cookie: { src: courseAssets.objects.cookie, label: 'cookie' },
  notebook: { src: courseAssets.objects.notebook, label: 'notebook' },
  openBook: { src: courseAssets.objects.openBook, label: 'open book' },
  ticket: { src: courseAssets.objects.ticket, label: 'ticket' },
  adultTicket: { src: courseAssets.objects.adultTicket, label: 'adult ticket' },
  childTicket: { src: courseAssets.objects.childTicket, label: 'child ticket' },
  shirt: { src: courseAssets.objects.shirt, label: 'shirt' },
  hat: { src: courseAssets.objects.hat, label: 'hat' },
  coins: { src: courseAssets.objects.coins, label: 'coins' },
  apple: { src: courseAssets.objects.apple, label: 'apple' },
  gameController: { src: courseAssets.objects.gameController, label: 'game controller' },
  flourCup: { src: courseAssets.objects.flourCup, label: 'flour cup' },
  sugarCup: { src: courseAssets.objects.sugarCup, label: 'sugar cup' },
  smoothieCup: { src: courseAssets.objects.smoothieCup, label: 'smoothie cup' },
  strawberry: { src: courseAssets.objects.strawberry, label: 'strawberry' },
  candy: { src: courseAssets.objects.candy, label: 'candy' },
  blockBlue: { src: courseAssets.levelVisuals.blockBlue, label: 'blue block' },
  blockYellow: { src: courseAssets.levelVisuals.blockYellow, label: 'yellow block' },
  sticker: null,
  gameCard: null,
  pen: null
} as const;

const blockFamily = [objectAssets.blockBlue, objectAssets.blockYellow, objectAssets.blockBlue, objectAssets.blockYellow];

const objectOnly = (object: VisualAssetRef | null, ageBand: VisualAgeBand, reason: string): ProblemVisualConfig => ({
  ageBand,
  intro: object ? { character: null, object, preset: 'objectOnlyRight' } : { character: null, object: null, preset: 'noAsset' },
  teaching: object ? { object, preset: 'objectOnlyLowRight' } : null,
  feedback: {},
  mappingReason: reason
});

const characterObject = (
  character: VisualAssetRef | null,
  object: VisualAssetRef | null,
  ageBand: VisualAgeBand,
  reason: string,
  supportingObject?: VisualAssetRef | null
): ProblemVisualConfig => ({
  ageBand,
  intro: character || object
    ? { character, object, supportingObject, preset: character && object ? 'characterObjectRight' : character ? 'characterOnlyRight' : 'objectOnlyRight' }
    : { character: null, object: null, preset: 'noAsset' },
  teaching: object ? { object, preset: 'objectOnlyLowRight' } : null,
  feedback: character ? { thinking: character, correct: character, retry: character } : {},
  mappingReason: reason
});

const blockGroup = (ageBand: VisualAgeBand, reason: string): ProblemVisualConfig => ({
  ageBand,
  intro: { character: null, object: null, objectFamily: blockFamily, preset: 'objectGroupRight' },
  teaching: { object: objectAssets.blockBlue, preset: 'objectOnlyLowRight' },
  feedback: {},
  mappingReason: reason
});

export const problemVisualConfig: Record<string, ProblemVisualConfig> = {
  's1-challenge': {
    ageBand: 'young',
    intro: {
      character: null,
      object: objectAssets.blueCrayon,
      supportingObject: objectAssets.yellowCrayon,
      preset: 'objectOnlyRight'
    },
    teaching: {
      object: objectAssets.blueCrayon,
      preset: 'objectOnlyLowRight'
    },
    feedback: {
    },
    mappingReason: 'The problem explicitly names Emma and crayons; crayon assets are available, but no approved Emma character file exists.'
  },
  's1-guided-sub': characterObject(characterAssets.benThinking, objectAssets.sticker, 'young', 'Ben is available; sticker is not available, so no sticker object is rendered.'),
  's1-guided-blocks': blockGroup('young', 'The problem context is a block tower; render a grouped composition from approved block PNGs, not one lonely block.'),
  's1-prac1': characterObject(null, objectAssets.blueCrayon, 'young', 'The problem literally uses crayons; Mia has no approved character asset.'),
  's1-prac2': {
    ageBand: 'young',
    intro: {
      character: null,
      object: objectAssets.cookie,
      preset: 'objectOnlyRight'
    },
    teaching: {
      object: objectAssets.cookie,
      preset: 'objectOnlyLowRight'
    },
    feedback: {},
    mappingReason: 'The problem explicitly names Omar and cookies; cookie is available, but no approved Omar character asset exists.'
  },
  's1-transfer': blockGroup('young', 'The problem uses add/take away blocks; render a non-counted grouped block composition.'),
  's2-challenge': characterObject(characterAssets.avaThinking, objectAssets.gameCard, 'young', 'Ava is available; game card asset is not available, so no false card/ticket substitute is rendered.'),
  's2-fewer-example': {
    ageBand: 'young',
    intro: {
      character: characterAssets.benThinking,
      object: objectAssets.sticker,
      preset: 'characterOnlyRight'
    },
    teaching: {
      object: objectAssets.sticker,
      preset: 'objectOnlyLowRight'
    },
    feedback: {
      thinking: characterAssets.benThinking,
      correct: characterAssets.benCorrect,
      retry: characterAssets.benThinking
    },
    mappingReason: 'The More/Fewer problem explicitly names Ben/Ava and stickers; Ben/Ava are available, but no approved sticker asset exists.'
  }
  ,
  's2-find-diff': characterObject(null, objectAssets.sticker, 'young', 'Sticker asset and Leo/Mia character assets are missing.'),
  's2-prac1': characterObject(null, objectAssets.blueCrayon, 'young', 'The problem literally uses crayons; Sara has no approved character asset.'),
  's2-transfer': characterObject(null, objectAssets.ticket, 'young', 'The problem literally uses tickets; Noah has no approved character asset.'),
  's3-challenge': objectOnly(objectAssets.cookie, 'young', 'The problem literally uses cookies; no named student appears in the question.'),
  's3-shirts': objectOnly(objectAssets.shirt, 'young', 'The problem literally uses shirts; no named student appears in the question.'),
  's3-points': characterObject(null, null, 'young', 'Game points have no literal approved raster asset; Leo/Mia character assets are missing.'),
  's3-transfer': characterObject(characterAssets.avaThinking, objectAssets.notebook, 'young', 'Ava and notebook are approved assets and match the problem context.'),
  's4-challenge': objectOnly(objectAssets.notebook, 'middle', 'The problem context uses notebooks/sketchbooks.'),
  's4-sketchbooks': objectOnly(objectAssets.notebook, 'middle', 'The problem context uses sketchbooks/notebooks.'),
  's4-clay': blockGroup('middle', 'The problem context uses clay blocks; render grouped block manipulatives only.'),
  's4-transfer': objectOnly(objectAssets.gameController, 'middle', 'The problem context is game quests/stars; use game controller, not a star as answer decoration.'),
  's5-challenge': objectOnly(objectAssets.pen, 'middle', 'Pen is literal but no approved pen asset exists.'),
  's5-tickets': objectOnly(objectAssets.ticket, 'middle', 'Ticket asset literally matches the problem.'),
  's5-notebooks': objectOnly(objectAssets.notebook, 'middle', 'Notebook asset literally matches the problem.'),
  's5-transfer': objectOnly(objectAssets.coins, 'middle', 'Coins/money literally match the savings context.'),
  's6-challenge': characterObject(null, objectAssets.flourCup, 'middle', 'Recipe asks for flour; use flour as the primary literal object with sugar as recipe context.', objectAssets.sugarCup),
  's6-smoothie': objectOnly(objectAssets.smoothieCup, 'middle', 'Smoothie asset literally matches the problem.'),
  's6-stickers': objectOnly(objectAssets.sticker, 'middle', 'Sticker asset is missing.'),
  's6-game-gems': objectOnly(objectAssets.gameController, 'middle', 'Game context is literal; no gem asset exists.'),
  's7-challenge': characterObject(null, objectAssets.adultTicket, 'senior', 'Adult and child ticket assets match the theater elimination context exactly.', objectAssets.childTicket),
  's7-shirts-hats': characterObject(null, objectAssets.shirt, 'senior', 'Shirt and hat assets match the shopping elimination context exactly.', objectAssets.hat),
  's7-notebooks': objectOnly(objectAssets.notebook, 'senior', 'Notebook asset literally matches the problem.'),
  's7-pens': objectOnly(objectAssets.pen, 'senior', 'Pen is literal but no approved pen asset exists.'),
  's8-challenge': objectOnly(objectAssets.coins, 'senior', 'Money context is literal; use coins only.'),
  's8-candy': objectOnly(objectAssets.candy, 'senior', 'Candy asset literally matches the problem.'),
  's8-ticket': objectOnly(objectAssets.ticket, 'senior', 'Ticket asset literally matches the problem.'),
  's8-cookie': objectOnly(objectAssets.cookie, 'senior', 'Cookie asset literally matches the problem.'),
  's8-transfer': objectOnly(objectAssets.gameCard, 'senior', 'Card-transfer context is literal, but no approved card asset exists; keep the visual zone empty instead of substituting.'),
  's9-challenge': blockGroup('senior', 'Master challenge uses blocks; use a restrained grouped block composition.'),
  's9-game': objectOnly(objectAssets.gameController, 'senior', 'Game context is literal.'),
  's9-transfer': objectOnly(objectAssets.gameController, 'senior', 'Game context is literal.')
};

export function getProblemVisualConfig(activityId: string): ProblemVisualConfig | null {
  return problemVisualConfig[activityId] ?? null;
}
