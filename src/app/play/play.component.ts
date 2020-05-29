import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, pipe } from 'rxjs';
import { Question } from '../models/question';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { QuizzService } from '../services/quizz.service';
import { switchMap, filter, first } from 'rxjs/operators';


export enum KEY_CODE {
  ONE = 49,
  TWO = 50,
  THREE = 51,
  FOUR = 52,
  FIVE = 53,
  SIX = 54,
  SEVEN = 55,
  HEIGHT = 56
}

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @ViewChild('commercial', { static: true }) commercialBreak: ElementRef<HTMLAudioElement>;
  @ViewChild('correct', { static: true }) correctAnswer: ElementRef<HTMLAudioElement>;
  @ViewChild('wrong', { static: true }) wrongAnswer: ElementRef<HTMLAudioElement>;
  @ViewChild('final', { static: true }) finalAnswer: ElementRef<HTMLAudioElement>;
  @ViewChild('phone', { static: true }) phoneCall: ElementRef<HTMLAudioElement>;
  @ViewChild('fifty', { static: true }) fiftyFifty: ElementRef<HTMLAudioElement>;
  @ViewChild('lowstress', { static: true }) lowStress: ElementRef<HTMLAudioElement>;
  @ViewChild('mediumstress', { static: true }) mediumStress: ElementRef<HTMLAudioElement>;
  @ViewChild('highstress', { static: true }) highStress: ElementRef<HTMLAudioElement>;


  questionSubject: BehaviorSubject<Question>;
  answerRemover: Subject<number>;
  title = 'wwtbam';
  currentQuestion: number
  questions: Question[];

  private readingCommercial = true;
  private readingCorrectAnswer = false;
  private readingWrongAnswer = false;
  private readingFinalAnswer = false;
  private readingPhoneCall = false;
  private readingFiftyFifty = false;
  private readingLowStress = false;
  private readingMediumStress = false;
  private readingHighStress = false;

  constructor(private route: ActivatedRoute, private quizzService: QuizzService) {
    this.questions = [{
      label: '',
      answers: []
    }];
    this.questionSubject = new BehaviorSubject(this.questions[0]);
    this.answerRemover = new Subject();
  }

  selectQuestion(index: number) {
    this.currentQuestion = index;
    this.questionSubject.next(this.questions[this.currentQuestion]);
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      filter((params: ParamMap) => params.get('quizz') !== null),
      switchMap((params: ParamMap) => {
        return this.quizzService.getQuizz(`quizz-${params.get('quizz')}`);
      }),
      first()
    ).subscribe(questions => {
      this.questions = questions;
      this.selectQuestion(0);
    });
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

  playLowStress() {
    this.lowStress.nativeElement.load();
    if (!this.readingLowStress) {
      this.lowStress.nativeElement.play();
      this.readingLowStress = true;
    } else {
      this.readingLowStress = false;
    }
  }

  playMediumStress() {
    this.mediumStress.nativeElement.load();
    if (!this.readingMediumStress) {
      this.mediumStress.nativeElement.play();
      this.readingMediumStress = true;
    } else {
      this.readingMediumStress = false;
    }
  }

  playHighStress() {
    this.highStress.nativeElement.load();
    if (!this.readingHighStress) {
      this.highStress.nativeElement.play();
      this.readingHighStress = true;
    } else {
      this.readingHighStress = false;
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
      case KEY_CODE.SIX:
        this.playLowStress();
        break;
      case KEY_CODE.SEVEN:
          this.playMediumStress();
          break;
      case KEY_CODE.HEIGHT:
          this.playHighStress();
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
    indexes.splice(indexToKeep, 1);
    indexes.forEach(i => this.answerRemover.next(i));
  }
}
