import { Component, ElementRef, HostListener, OnInit, Signal, inject, viewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Question } from '../models/question';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { QuizzService } from '../services/quizz.service';
import { switchMap, filter, first } from 'rxjs/operators';
import { QuestionComponent } from '../question/question.component';
import { JokersComponent } from '../jokers/jokers.component';
import { FormsModule } from '@angular/forms';


export enum KEY_CODE {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8'
}

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  imports: [QuestionComponent, JokersComponent, FormsModule],
  standalone: true
})
export class PlayComponent implements OnInit {
  commercialBreak = viewChild<ElementRef<HTMLAudioElement>>('commercial');
  correctAnswer = viewChild<ElementRef<HTMLAudioElement>>('correct');
  wrongAnswer = viewChild<ElementRef<HTMLAudioElement>>('wrong');
  finalAnswer = viewChild<ElementRef<HTMLAudioElement>>('final');
  phoneCall = viewChild<ElementRef<HTMLAudioElement>>('phone');
  fiftyFifty = viewChild<ElementRef<HTMLAudioElement>>('fifty');
  lowStress = viewChild<ElementRef<HTMLAudioElement>>('lowstress');
  mediumStress = viewChild<ElementRef<HTMLAudioElement>>('mediumstress');
  highStress = viewChild<ElementRef<HTMLAudioElement>>('highstress');


  questionSubject: BehaviorSubject<Question>;
  answerRemover: Subject<number>;
  title = 'wwtbam';
  currentQuestion = 0;
  questions: Question[];
  theme: string = '';

  readingCommercial = false;
  readingCorrectAnswer = false;
  readingWrongAnswer = false;
  readingFinalAnswer = false;
  readingPhoneCall = false;
  readingFiftyFifty = false;
  readingLowStress = false;
  readingMediumStress = false;
  readingHighStress = false;

  private route = inject(ActivatedRoute);
  private quizzService = inject(QuizzService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.questions = [{
      label: '',
      answers: []
    }];
    this.questionSubject = new BehaviorSubject(this.questions[0]);
    this.answerRemover = new Subject();
  }

  get reversedQuestions(): Question[] {
    return [...this.questions].reverse();
  }

  selectQuestion(index: number) {
    this.currentQuestion = index;
    this.questionSubject.next(this.questions[this.currentQuestion]);
    this.cdr.markForCheck();
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
      this.playCommercialBreak();
      this.cdr.markForCheck();
    });
    
  }

  generateQuizz(): void {
    if (this.theme.trim()) {
      this.quizzService.generateQuizz(this.theme).subscribe(questions => {
        this.questions = questions;
        this.selectQuestion(0);
        this.playCommercialBreak();
        this.cdr.markForCheck();
      });
    }
  }

  private toggleAudio(player: Signal<ElementRef<HTMLAudioElement> | undefined>, isPlaying: boolean): boolean {
    player()?.nativeElement.load();
    if (!isPlaying) {
      player()?.nativeElement.play();
      return true;
    }
    return false;
  }

  playCommercialBreak() {
    this.readingCommercial = this.toggleAudio(this.commercialBreak, this.readingCommercial);
  }

  playCorrectAnswer() {
    this.readingCorrectAnswer = this.toggleAudio(this.correctAnswer, this.readingCorrectAnswer);
  }

  playWrongAnswer() {
    this.readingWrongAnswer = this.toggleAudio(this.wrongAnswer, this.readingWrongAnswer);
  }

  playFinalAnswer() {
    this.readingFinalAnswer = this.toggleAudio(this.finalAnswer, this.readingFinalAnswer);
  }

  playPhoneCall() {
    this.readingPhoneCall = this.toggleAudio(this.phoneCall, this.readingPhoneCall);
  }

  play5050() {
    this.readingFiftyFifty = this.toggleAudio(this.fiftyFifty, this.readingFiftyFifty);
  }

  playLowStress() {
    this.readingLowStress = this.toggleAudio(this.lowStress, this.readingLowStress);
  }

  playMediumStress() {
    this.readingMediumStress = this.toggleAudio(this.mediumStress, this.readingMediumStress);
  }

  playHighStress() {
    this.readingHighStress = this.toggleAudio(this.highStress, this.readingHighStress);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.debug(`Key pressed: ${event.key}`);
    switch (event.key) {
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
      case KEY_CODE.EIGHT:
        this.playHighStress();
        break;
      default:
        break;
    }
  }

  correctAnswered() {
    this.finalAnswer()?.nativeElement.load();
    this.readingFinalAnswer = false;
    this.playCorrectAnswer();
    setTimeout(() => this.selectQuestion(this.currentQuestion + 1), 7000);
  }


  wrongAnswered() {
    this.finalAnswer()?.nativeElement.load();
    this.readingFinalAnswer = false;
    this.playWrongAnswer();
  }

  callJokerUsed() {
    this.playPhoneCall();
  }

  answerSelected() {
    this.finalAnswer()?.nativeElement.load();
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
