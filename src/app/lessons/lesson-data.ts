import type { LessonDefinition } from './lesson-definition';
import { createLesson01Set } from './examples/lesson01';
import { createLesson02Set } from './examples/lesson02';
import { createLesson03Set } from './examples/lesson03';
import { createLesson04Set } from './examples/lesson04';
import { createLesson05Set } from './examples/lesson05';
import { createLesson06Set } from './examples/lesson06';
import { createLesson07Set } from './examples/lesson07';
import { createLesson08Set } from './examples/lesson08';
import { createLesson09Set } from './examples/lesson09';
import { createLesson10Set } from './examples/lesson10';
import { createLesson11Set } from './examples/lesson11';
import { createLesson12Set } from './examples/lesson12';

export const LESSONS: LessonDefinition[] = [
  {
    id: 'lesson-01',
    category: 'npe',
    translationKey: 'lesson1',
    createSet: createLesson01Set,
  },
  {
    id: 'lesson-02',
    category: 'npe',
    translationKey: 'lesson2',
    createSet: createLesson02Set,
  },
  {
    id: 'lesson-03',
    category: 'npe',
    translationKey: 'lesson3',
    createSet: createLesson03Set,
  },
  {
    id: 'lesson-04',
    category: 'npe',
    translationKey: 'lesson4',
    createSet: createLesson04Set,
  },
  {
    id: 'lesson-05',
    category: 'npe',
    translationKey: 'lesson5',
    createSet: createLesson05Set,
  },
  {
    id: 'lesson-06',
    category: 'npe',
    translationKey: 'lesson6',
    createSet: createLesson06Set,
  },
  {
    id: 'lesson-07',
    category: 'npe',
    translationKey: 'lesson7',
    createSet: createLesson07Set,
  },
  {
    id: 'lesson-08',
    category: 'npe',
    translationKey: 'lesson8',
    createSet: createLesson08Set,
  },
  {
    id: 'lesson-09',
    category: 'npe',
    translationKey: 'lesson9',
    createSet: createLesson09Set,
  },
  {
    id: 'lesson-10',
    category: 'npe',
    translationKey: 'lesson10',
    createSet: createLesson10Set,
  },
  {
    id: 'lesson-11',
    category: 'npe',
    translationKey: 'lesson11',
    createSet: createLesson11Set,
  },
  {
    id: 'lesson-12',
    category: 'npe',
    translationKey: 'lesson12',
    createSet: createLesson12Set,
  },
];
