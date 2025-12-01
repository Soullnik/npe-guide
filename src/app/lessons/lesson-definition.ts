import type { NodeParticleSystemSet } from 'babylonjs';

export type LessonCategory = 'npe' | string;

export interface LessonDefinition {
  id: string;
  category: LessonCategory;
  translationKey: string;
  createSet: (existingSet?: NodeParticleSystemSet) => NodeParticleSystemSet;
}

