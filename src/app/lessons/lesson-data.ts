import type { LessonDefinition } from './lesson-definition';
import {
  createLesson01Set,
  createLesson02Set,
  createLesson03Set,
  createLesson04Set,
  createLesson05Set,
  createLesson06Set,
  createLesson07Set,
  createLesson09Set,
  createLesson10Set,
  createLesson10SetNew,
  createLesson11Set,
  createLesson12Set,
} from './lesson-examples';

export const LESSONS: LessonDefinition[] = [
  {
    id: 'lesson-01',
    translationKey: 'lesson1',
    createSet: createLesson01Set,
  },
  {
    id: 'lesson-02',
    translationKey: 'lesson2',
    createSet: createLesson02Set,
  },
  {
    id: 'lesson-03',
    translationKey: 'lesson3',
    createSet: createLesson03Set,
  },
  {
    id: 'lesson-04',
    translationKey: 'lesson4',
    createSet: createLesson04Set,
  },
  {
    id: 'lesson-05',
    translationKey: 'lesson5',
    createSet: createLesson05Set,
  },
  {
    id: 'lesson-06',
    translationKey: 'lesson6',
    createSet: createLesson06Set,
  },
  {
    id: 'lesson-07',
    translationKey: 'lesson7',
    createSet: createLesson07Set,
  },
  {
    id: 'lesson-08',
    translationKey: 'lesson8',
    createSet: createLesson09Set,
  },
  {
    id: 'lesson-09',
    translationKey: 'lesson9',
    createSet: createLesson10Set,
  },
  {
    id: 'lesson-10',
    translationKey: 'lesson10',
    createSet: createLesson10SetNew,
  },
  {
    id: 'lesson-11',
    translationKey: 'lesson11',
    createSet: createLesson11Set,
  },
  {
    id: 'lesson-12',
    translationKey: 'lesson12',
    createSet: createLesson12Set,
  },
];
