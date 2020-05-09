import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
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
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input()
  questionSubject: BehaviorSubject<Question>;

  @Input()
  answerRemover: Subject<number>;

  @Output()
  wrongAnswered = new EventEmitter<any>();

  @Output()
  correctAnswered = new EventEmitter<any>();

  @Output()
  answerSelected = new EventEmitter<any>();

  question: Question;

  answerClasses: string[] = [];

  private title = 'Qui veut gagner des boissons ?';

  private selectedAnswer = -1;

  private questionSubscription: Subscription;
  private answerRemoverSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.questionSubscription = this.questionSubject.asObservable().subscribe(q => {
      this.question = q;
      this.selectedAnswer = -1;
      this.hideAnswers();
    });

    this.answerRemoverSubscription = this.answerRemover.asObservable().subscribe(i => {
      this.hideAnswer(i);
    });
  }

  ngOnDestroy(): void {
    this.questionSubscription.unsubscribe();
    this.answerRemoverSubscription.unsubscribe();
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
    this.question.answers.forEach((a, i) => this.hideAnswer(i));
  }

  private hideAnswer(index: number) {
    if (index % 2 !== 0) {
      this.answerClasses[index] = `answer answer-right answer-right${AnswerState.UNREVEALED}`;
    } else {
      this.answerClasses[index] = `answer answer-left answer-left${AnswerState.UNREVEALED}`;
    }
  }

  lastWord() {
    if (this.selectedAnswer !== -1) {
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
