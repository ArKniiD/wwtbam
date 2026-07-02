import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Question, QuestionsSchema } from '../models/question';
import OpenAI from 'openai';
import { environment } from '../../environments/environment';
import { zodResponseFormat } from "openai/helpers/zod";

@Injectable({
  providedIn: 'root'
})
export class QuizzService {
  private httpClient = inject(HttpClient);
  private openai = new OpenAI({ apiKey: environment.openaiApiKey, dangerouslyAllowBrowser: true });
  private prompts: { [key: string]: string } = {
    'en': `Generate a quiz on the theme "$theme" with exactly 15 multiple-choice questions. Each question must have 4 answer options, and one correct answer indicated by its index (0-based).

Difficulty progression:
- Questions 1-5: Very easy, with a bit of humor.
- Questions 6-10: Medium to difficult.
- Questions 11-15: Difficult to very hard.

Values (points) should increase progressively, starting from 0.05 for the first, up to higher values like 0.1, 0.2, 0.5, 1.0, etc., reflecting difficulty.

Output only a valid JSON array of objects, each with:
- "label": string (the question text)
- "answers": array of 4 strings
- "rightAnswer": number (0-3)
- "value": number (increasing)

No additional text, just the JSON array.`,
    'fr': `Génère un quiz sur le thème "$theme" avec exactement 15 questions à choix multiples. Chaque question doit avoir 4 options de réponse, et une réponse correcte indiquée par son index (0-based).
Progression de la difficulté :
- Questions 1-5 : Très facile, avec un peu d'humour.
- Questions 6-10 : Moyen à difficile.
- Questions 11-15 : Difficile à très difficile et piègeuses.

Les valeurs (points) doivent augmenter progressivement, en commençant par 0.05 pour la première, jusqu'à des valeurs plus élevées comme 0.1, 0.2, 0.5, 1.0, etc., reflétant la difficulté.
Les réponses doivent être variées, créatives, et doivent être aléatoirement distribuées (pas toujours la même réponse correcte) et les questions doivent être pertinentes par rapport au thème et triées par difficulté.

Sortie uniquement un tableau JSON valide d'objets, chacun avec :
- "label" : string (le texte de la question)
- "answers" : tableau de 4 chaînes
- "rightAnswer" : number (0-3)
- "value" : number (en augmentation)

Aucun texte supplémentaire, juste le tableau JSON.`
  };

  getQuizz(quizzId: string): Observable<Question[]> {
    return this.httpClient.get<Question[]>(`assets/quizz/${quizzId}.json`);
  }

  generateQuizz(theme: string): Observable<Question[]> {
    const prompt = this.prompts[environment.language]?.replace('$theme', theme) || this.prompts['en'].replace('$theme', theme);

    const promise = this.openai.chat.completions.parse({
      model: 'gpt-5.5', //'gpt-5.4-mini'
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 4000,
      temperature: 1.0,
      response_format: zodResponseFormat(QuestionsSchema, "questions")
    }).then(response => {
      const content = response.choices[0]?.message?.parsed;
      if (!content) throw new Error('No response from OpenAI');
      try {
        const questions: Question[] = content.questions;
        if (!Array.isArray(questions) || questions.length !== 15) {
          throw new Error('Invalid quiz format');
        }
        return questions;
      } catch (e) {
        throw new Error('Failed to parse JSON: ' + (e instanceof Error ? e.message : String(e)));
      }
    });

    return from(promise);
  }
}
