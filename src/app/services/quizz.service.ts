import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuizzService {

  constructor(private httpClient: HttpClient) { }

  getQuizz(quizzId: string) : Observable<Question[]>{
    return this.httpClient.get<Question[]>(`assets/quizz/${quizzId}.json`);
  }

}
