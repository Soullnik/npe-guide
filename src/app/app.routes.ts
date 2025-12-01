import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LessonComponent } from './lessons/lesson/lesson.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'lessons/:id',
    component: LessonComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
