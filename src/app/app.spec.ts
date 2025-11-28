import { TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { App } from './app';

describe('App', () => {
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.setTranslation(
      'en',
      {
        ui: {
          menu: 'Lessons',
          product: 'Product',
          heroTitle: 'Test Hero Title',
          heroSubtitle: 'Subtitle',
          language: 'Language',
          lessonList: 'Library',
          editorLabel: 'Editor',
          noLesson: 'No lesson',
        },
        lessons: {
          lesson1: {
            title: 'Lesson 1 · Test',
            summary: 'Summary',
            intro: '',
            stepsTitle: '',
            steps: [],
            codeTitle: '',
            codeCopy: '',
            homeworkTitle: '',
            homework: [],
          },
        },
      },
      true,
    );
    translate.use('en');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render hero title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Test Hero Title');
  });
});
