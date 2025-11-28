import type { NodeParticleSystemSet } from 'babylonjs';

export interface LessonDefinition {
  id: string;
  translationKey: string;
  createSet: () => NodeParticleSystemSet;
}

