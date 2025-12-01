import type { NodeParticleSystemSet } from 'babylonjs';

export type LessonCategory = 'npe' | string;
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Topic {
  id: number;
  difficulty: Difficulty;
  lessons: LessonDefinition[];
}

export interface LessonDefinition {
  id: string; // Format: "topic-{topicId}-lesson-{lessonNumber}" or "t{topicId}-l{lessonNumber}"
  topicId: number;
  lessonNumber: number;
  category: LessonCategory;
  translationKey: string; // Format: "topic{topicId}.lesson{lessonNumber}"
  createSet: (existingSet?: NodeParticleSystemSet) => NodeParticleSystemSet;
  prerequisites?: string[]; // IDs of lessons that must be completed before this one
}

