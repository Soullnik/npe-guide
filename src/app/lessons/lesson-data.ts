import type { LessonDefinition } from './lesson-definition';
import {
  createTopic1Lesson1Set,
  createTopic1Lesson2Set,
  createTopic1Lesson3Set,
  createTopic1Lesson4Set,
} from './examples/topic1';
import { createTopic2Lesson1Set, createTopic2Lesson2Set, createTopic2Lesson3Set, createTopic2Lesson4Set } from './examples/topic2';
import { createTopic3Lesson1Set, createTopic3Lesson2Set, createTopic3Lesson3Set } from './examples/topic3';
import { createTopic4Lesson1Set, createTopic4Lesson2Set } from './examples/topic4';
import { createTopic5Lesson1Set, createTopic5Lesson2Set } from './examples/topic5';
import { createTopic6Lesson1Set, createTopic6Lesson2Set, createTopic6Lesson3Set, createTopic6Lesson4Set } from './examples/topic6';

export const LESSONS: LessonDefinition[] = [
  // Topic 1: Basics
  {
    id: 'topic-1-lesson-1',
    topicId: 1,
    lessonNumber: 1,
    category: 'npe',
    translationKey: 'topic1.lesson1',
    createSet: createTopic1Lesson1Set,
  },
  {
    id: 'topic-1-lesson-2',
    topicId: 1,
    lessonNumber: 2,
    category: 'npe',
    translationKey: 'topic1.lesson2',
    createSet: createTopic1Lesson2Set,
  },
  {
    id: 'topic-1-lesson-3',
    topicId: 1,
    lessonNumber: 3,
    category: 'npe',
    translationKey: 'topic1.lesson3',
    createSet: createTopic1Lesson3Set,
  },
  {
    id: 'topic-1-lesson-4',
    topicId: 1,
    lessonNumber: 4,
    category: 'npe',
    translationKey: 'topic1.lesson4',
    createSet: createTopic1Lesson4Set,
  },
  // Topic 2: Emitters & Shapes
  {
    id: 'topic-2-lesson-1',
    topicId: 2,
    lessonNumber: 1,
    category: 'npe',
    translationKey: 'topic2.lesson1',
    createSet: createTopic2Lesson1Set,
  },
  // Topic 3: Physics & Movement
  {
    id: 'topic-3-lesson-1',
    topicId: 3,
    lessonNumber: 1,
    category: 'npe',
    translationKey: 'topic3.lesson1',
    createSet: createTopic3Lesson1Set,
  },
  // Topic 4: Color & Visual Effects
  {
    id: 'topic-4-lesson-1',
    topicId: 4,
    lessonNumber: 1,
    category: 'npe',
    translationKey: 'topic4.lesson1',
    createSet: createTopic4Lesson1Set,
  },
  // Topic 2: Emitters & Shapes (continued)
  {
    id: 'topic-2-lesson-2',
    topicId: 2,
    lessonNumber: 2,
    category: 'npe',
    translationKey: 'topic2.lesson2',
    createSet: createTopic2Lesson2Set,
  },
  {
    id: 'topic-2-lesson-3',
    topicId: 2,
    lessonNumber: 3,
    category: 'npe',
    translationKey: 'topic2.lesson3',
    createSet: createTopic2Lesson3Set,
  },
  {
    id: 'topic-2-lesson-4',
    topicId: 2,
    lessonNumber: 4,
    category: 'npe',
    translationKey: 'topic2.lesson4',
    createSet: createTopic2Lesson4Set,
  },
  // Topic 3: Physics & Movement (continued)
  {
    id: 'topic-3-lesson-2',
    topicId: 3,
    lessonNumber: 2,
    category: 'npe',
    translationKey: 'topic3.lesson2',
    createSet: createTopic3Lesson2Set,
  },
  // Topic 3: Physics & Movement (continued)
  {
    id: 'topic-3-lesson-3',
    topicId: 3,
    lessonNumber: 3,
    category: 'npe',
    translationKey: 'topic3.lesson3',
    createSet: createTopic3Lesson3Set,
  },
  // Topic 5: Math & Logic
  {
    id: 'topic-5-lesson-1',
    topicId: 5,
    lessonNumber: 1,
    category: 'npe',
    translationKey: 'topic5.lesson1',
    createSet: createTopic5Lesson1Set,
  },
  // Topic 4: Color & Visual Effects (continued)
  {
    id: 'topic-4-lesson-2',
    topicId: 4,
    lessonNumber: 2,
    category: 'npe',
    translationKey: 'topic4.lesson2',
    createSet: createTopic4Lesson2Set,
  },
  // Topic 5: Math & Logic (continued)
  {
    id: 'topic-5-lesson-2',
    topicId: 5,
    lessonNumber: 2,
    category: 'npe',
    translationKey: 'topic5.lesson2',
    createSet: createTopic5Lesson2Set,
  },
  // Topic 6: Advanced Techniques
  {
    id: 'topic-6-lesson-1',
    topicId: 6,
    lessonNumber: 1,
    category: 'npe',
    translationKey: 'topic6.lesson1',
    createSet: createTopic6Lesson1Set,
  },
  {
    id: 'topic-6-lesson-2',
    topicId: 6,
    lessonNumber: 2,
    category: 'npe',
    translationKey: 'topic6.lesson2',
    createSet: createTopic6Lesson2Set,
  },
  {
    id: 'topic-6-lesson-3',
    topicId: 6,
    lessonNumber: 3,
    category: 'npe',
    translationKey: 'topic6.lesson3',
    createSet: createTopic6Lesson3Set,
  },
  {
    id: 'topic-6-lesson-4',
    topicId: 6,
    lessonNumber: 4,
    category: 'npe',
    translationKey: 'topic6.lesson4',
    createSet: createTopic6Lesson4Set,
  },
];
