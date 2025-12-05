import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LessonComponent } from './lessons/lesson/lesson.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'lessons/topic/:topicId/lesson/:lessonNumber',
    component: LessonComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
