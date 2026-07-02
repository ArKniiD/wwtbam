import { z } from "zod";

export class Question {
  label: string = '';
  answers: string[] = [];
  rightAnswer?: number;
  value?: number;
}

export const QuestionSchema = z.object({
  label: z.string(),
  answers: z.array(z.string()).length(4),
  rightAnswer: z.number().int(),
  value: z.number()
});

export const QuestionsSchema = z.object({
  questions: z.array(QuestionSchema).length(15)
});