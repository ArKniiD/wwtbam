import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Subject } from 'rxjs';
import { Question } from '../models/question';

export enum AnswerState {
  UNREVEALED = '__unrevealed',
  REVEALED = '__revealed',
  SELECTED = '__selected',
  CORRECT = '__correct'
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true
})
export class QuestionComponent implements OnInit {
  @Input()
  questionSubject: BehaviorSubject<Question> = new BehaviorSubject<Question>({
    label: '',
    answers: []
  });

  @Input()
  answerRemover: Subject<number> = new Subject<number>();

  @Output()
  wrongAnswered = new EventEmitter<void>();

  @Output()
  correctAnswered = new EventEmitter<void>();

  @Output()
  answerSelected = new EventEmitter<void>();

  question: Question = {
    label: '',
    answers: []
  };

  answerClasses: string[] = [];

  private title = 'Qui veut gagner des boissons ?';

  private selectedAnswer = -1;
  jpf = 0;

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.questionSubject
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(q => {
        this.question = q;
        this.selectedAnswer = -1;
        this.hideAnswers();
        this.jpf = Math.ceil(Math.random() * 7);
      });

    this.answerRemover
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(i => {
        this.hideAnswer(i);
      });
  }

  get getTitle() {
    return this.title;
  }

  get isThisYourLastWord() {
    return this.selectedAnswer !== -1;
  }

  selectAnswer(index: number) {
    if (this.answerClasses[index].includes(AnswerState.REVEALED) && !this.isThisYourLastWord) {
      this.answerClasses[index] = this.answerClasses[index].replace(AnswerState.REVEALED, AnswerState.SELECTED);
      this.selectedAnswer = index;
      this.answerSelected.emit();
    } else if (this.answerClasses[index].includes(AnswerState.SELECTED)) {
      this.answerClasses[index] = this.answerClasses[index].replace(AnswerState.SELECTED, AnswerState.REVEALED);
      this.selectedAnswer = -1;
    } else {
      this.answerClasses[index] = this.answerClasses[index].replace(AnswerState.UNREVEALED, AnswerState.REVEALED);
    }
  }

  private hideAnswers() {
    this.question.answers.forEach((_, i) => this.hideAnswer(i));
  }

  private hideAnswer(index: number) {
    if (index % 2 !== 0) {
      this.answerClasses[index] = `answer answer-right answer-right${AnswerState.UNREVEALED}`;
    } else {
      this.answerClasses[index] = `answer answer-left answer-left${AnswerState.UNREVEALED}`;
    }
  }

  lastWord() {
    if (this.selectedAnswer !== -1 && this.question.rightAnswer !== undefined) {
      if (this.question.rightAnswer % 2 !== 0) {
        this.answerClasses[this.question.rightAnswer] = `answer answer-right answer-right${AnswerState.CORRECT}`;
      } else {
        this.answerClasses[this.question.rightAnswer] = `answer answer-left answer-left${AnswerState.CORRECT}`;
      }
      if (this.selectedAnswer === this.question.rightAnswer) {
        this.correctAnswered.emit();
      } else {
        this.wrongAnswered.emit();
      }
    }
  }
}
