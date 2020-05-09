import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import Quizz from '../assets/quizz.json';
import { Question } from './models/question';


export enum KEY_CODE {
  ONE = 97,
  TWO = 98,
  THREE = 99,
  FOUR = 100,
  FIVE = 101
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('commercial', { static: true }) commercialBreak: ElementRef<HTMLAudioElement>;
  @ViewChild('correct', { static: true }) correctAnswer: ElementRef<HTMLAudioElement>;
  @ViewChild('wrong', { static: true }) wrongAnswer: ElementRef<HTMLAudioElement>;
  @ViewChild('final', { static: true }) finalAnswer: ElementRef<HTMLAudioElement>;
  @ViewChild('phone', { static: true }) phoneCall: ElementRef<HTMLAudioElement>;
  @ViewChild('fifty', { static: true }) fiftyFifty: ElementRef<HTMLAudioElement>;

  questionSubject: BehaviorSubject<Question>;
  answerRemover: Subject<number>;
  title = 'wwtbam';
  currentQuestion = 0;
  questions: Question[];

  private readingCommercial = true;
  private readingCorrectAnswer = false;
  private readingWrongAnswer = false;
  private readingFinalAnswer = false;
  private readingPhoneCall = false;
  private readingFiftyFifty = false;

  constructor() {
    this.questions = Quizz;
    this.questionSubject = new BehaviorSubject(this.questions[this.currentQuestion]);
    this.answerRemover = new Subject();
  }

  selectQuestion(index: number) {
    this.currentQuestion = index;
    this.questionSubject.next(this.questions[this.currentQuestion]);
  }

  ngOnInit(): void {
    this.playCommercialBreak();
  }

  playCommercialBreak() {
    this.commercialBreak.nativeElement.load();
    if (!this.readingCommercial) {
      this.commercialBreak.nativeElement.play();
      this.readingCommercial = true;
    } else {
      this.readingCommercial = false;
    }
  }

  playCorrectAnswer() {
    this.correctAnswer.nativeElement.load();
    if (!this.readingCorrectAnswer) {
      this.correctAnswer.nativeElement.play();
      this.readingCorrectAnswer = true;
    } else {
      this.readingCorrectAnswer = false;
    }
  }

  playWrongAnswer() {
    this.wrongAnswer.nativeElement.load();
    if (!this.readingWrongAnswer) {
      this.wrongAnswer.nativeElement.play();
      this.readingWrongAnswer = true;
    } else {
      this.readingWrongAnswer = false;
    }
  }

  playFinalAnswer() {
    this.finalAnswer.nativeElement.load();
    if (!this.readingFinalAnswer) {
      this.finalAnswer.nativeElement.play();
      this.readingFinalAnswer = true;
    } else {
      this.readingFinalAnswer = false;
    }
  }

  playPhoneCall() {
    this.phoneCall.nativeElement.load();
    if (!this.readingPhoneCall) {
      this.phoneCall.nativeElement.play();
      this.readingPhoneCall = true;
    } else {
      this.readingPhoneCall = false;
    }
  }

  play5050() {
    this.fiftyFifty.nativeElement.load();
    if (!this.readingFiftyFifty) {
      this.fiftyFifty.nativeElement.play();
      this.readingFiftyFifty = true;
    } else {
      this.readingFiftyFifty = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.ONE:
        this.playCommercialBreak();
        break;
      case KEY_CODE.TWO:
        this.playCorrectAnswer();
        break;
      case KEY_CODE.THREE:
        this.playWrongAnswer();
        break;
      case KEY_CODE.FOUR:
        this.playFinalAnswer();
        break;
      case KEY_CODE.FIVE:
        this.playPhoneCall();
        break;
      default:
        console.error('Unrecognized key', event);
    }
  }

  correctAnswered() {
    this.finalAnswer.nativeElement.load();
    this.readingFinalAnswer = false;
    this.playCorrectAnswer();
    setTimeout(() => this.selectQuestion(this.currentQuestion + 1), 7000);
  }


  wrongAnswered() {
    this.finalAnswer.nativeElement.load();
    this.readingFinalAnswer = false;
    this.playWrongAnswer();
  }

  callJokerUsed() {
    this.playPhoneCall();
  }

  answerSelected() {
    this.finalAnswer.nativeElement.load();
    this.readingFinalAnswer = false;
    this.playFinalAnswer();
  }

  fiftyFiftyJokerUsed() {
    this.play5050();
    let indexes = [0, 1, 2, 3].filter(i => i !== this.questionSubject.getValue().rightAnswer);
    const indexToKeep = Math.floor(Math.random() * indexes.length);
    indexes = indexes.filter(i => indexToKeep !== i)
    indexes.forEach(i => this.answerRemover.next(i));
  }
}
