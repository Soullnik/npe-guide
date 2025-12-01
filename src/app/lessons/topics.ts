import type { Topic } from './lesson-definition';
import { LESSONS } from './lesson-data';

/**
 * Organizes lessons into topics for better structure and navigation
 * Topics are ordered by difficulty: beginner -> intermediate -> advanced
 */
export const TOPICS: Topic[] = [
  // Beginner topics
  {
    id: 1,
    difficulty: 'beginner',
    lessons: LESSONS.filter((l) => l.topicId === 1),
  },
  {
    id: 2,
    difficulty: 'beginner',
    lessons: LESSONS.filter((l) => l.topicId === 2),
  },
  // Intermediate topics
  {
    id: 3,
    difficulty: 'intermediate',
    lessons: LESSONS.filter((l) => l.topicId === 3),
  },
  {
    id: 4,
    difficulty: 'intermediate',
    lessons: LESSONS.filter((l) => l.topicId === 4),
  },
  // Advanced topics
  {
    id: 5,
    difficulty: 'advanced',
    lessons: LESSONS.filter((l) => l.topicId === 5),
  },
  {
    id: 6,
    difficulty: 'advanced',
    lessons: LESSONS.filter((l) => l.topicId === 6),
  },
];

/**
 * Get a topic by its ID
 */
export function getTopicById(topicId: number): Topic | undefined {
  return TOPICS.find((t) => t.id === topicId);
}

/**
 * Get a lesson by its topic and lesson number
 */
export function getLessonByTopicAndNumber(topicId: number, lessonNumber: number) {
  const topic = getTopicById(topicId);
  return topic?.lessons.find((l) => l.lessonNumber === lessonNumber);
}

