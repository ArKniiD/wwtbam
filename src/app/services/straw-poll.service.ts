import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Question } from '../models/question';
import { StrawPoll } from '../models/straw-poll';

@Injectable({
  providedIn: 'root'
})
export class StrawPollService {
  private url = 'https://strawpoll.com';

  constructor(private http: HttpClient) {
  }

  createPoll(question: Question): Observable<string> {
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);
    const data = {
      poll: {
        title: `Question à ${question.value}€`,
        description: question.label,
        answers: question.answers,
        deadline: tommorow.toISOString()
      } as StrawPoll
    };
    return this.http.post<string>(
      `${this.url}/api/poll`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).pipe(map((response: any) => `${this.url}/${response.content_id}`));
  }
}
