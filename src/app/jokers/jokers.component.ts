import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { interval, timer } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { StrawPollService } from '../services/straw-poll.service';
import { Question } from '../models/question';

const THREEPIBYTWO = (3 * Math.PI) / 2;

@Component({
  selector: 'app-jokers',
  templateUrl: './jokers.component.html',
  styleUrls: ['./jokers.component.scss']
})
export class JokersComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private sec = 43;
  private callJokerUsed = false;
  private fiftyFiftyJokerUsed = false;
  private pollJokerUrl = '';

  @Output()
  callJokerEvent = new EventEmitter<any>();
  @Output()
  fiftyFiftyJokerEvent = new EventEmitter<any>();
  @Input()
  question: Question;

  constructor(private poll: StrawPollService) {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.init();
    this.draw(this.sec);
  }

  init() {
    this.canvas.nativeElement.width = 200;
    this.canvas.nativeElement.height = 200;
  }

  draw(time) {
    const centerX = this.canvas.nativeElement.width / 2;
    const centerY = this.canvas.nativeElement.height / 2;

    const radS = (2 * time * Math.PI) / this.sec;

    const minThreshold = 0;
    const maxThreshold = 255;

    let green;
    let red;
    const blue = minThreshold;
    const step = 2 * (maxThreshold - minThreshold) / this.sec;

    if (time < this.sec / 2) {
      green = maxThreshold - (step * (this.sec / 2 - time));
      red = maxThreshold;
    } else {
      red = minThreshold + (step * (this.sec - time));
      green = maxThreshold;
    }

    this.drawRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height, 'transparent');
    this.drawCircle(centerX, centerY, 85, 0, Math.PI * 2, false, '#6485c3', 'stroke', 30); //secondgrey
    this.drawCircle(centerX, centerY, 85, THREEPIBYTWO, radS + THREEPIBYTWO, false, `rgb(${Math.round(red)},${Math.round(green)},${blue})`, 'stroke', 30); //second
    this.drawCircle(centerX, centerY, 70, 0, Math.PI * 2, false, '#231f20', 'fill', '50'); //inner
    if (time < 10) {
      this.drawText(`${time}`, this.canvas.nativeElement.width / 2 - 20, this.canvas.nativeElement.height / 2 + 22, '#ffffff', '60px');
    } else {
      this.drawText(`${time}`, this.canvas.nativeElement.width / 2 - 38, this.canvas.nativeElement.height / 2 + 22, '#ffffff', '60px');
    }
  }

  drawText(text, x, y, color, size) {
    this.ctx.font = `${size} "DejaVu Sans Light"`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  drawArc(x, y, radius, start, end, clockwise) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, start, end, clockwise);
  }

  drawCircle(x, y, radius, start, end, clockwise, color, type, thickness) {
    if (type === 'fill') {
      this.ctx.fillStyle = color;
      this.drawArc(x, y, radius, start, end, clockwise);
      this.ctx.fill();
    } else if (type === 'stroke') {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = thickness;
      this.drawArc(x, y, radius, start, end, clockwise);
      this.ctx.stroke();
    }
  }

  useCallJoker() {
    if (!this.callJokerUsed) {
      this.callJokerEvent.emit();
      timer(0, 1000)
        .pipe(takeUntil(interval(this.sec * 1000).pipe(
          map(j => {
            this.callJokerUsed = true;
          })
        )))
        .subscribe((t) => this.draw(this.sec - t - 1));

    }
  }

  usePollJoker() {
    if (this.pollJokerUrl === '') {
      this.poll.createPoll(this.question)
        .pipe(first())
        .subscribe(url => {
          this.pollJokerUrl = url;
          console.log(url);
        });
    }
  }

  useFiftyFiftyJoker() {
    if (!this.fiftyFiftyJokerUsed) {
      this.fiftyFiftyJokerEvent.emit();
      this.fiftyFiftyJokerUsed = true;
    }
  }
}
