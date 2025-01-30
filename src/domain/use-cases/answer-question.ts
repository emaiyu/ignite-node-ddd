import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "../entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";

interface AnswerQuestionPayload {
  instructorId: string;
  questionId: string;
  content: string;
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}
  async execute(payload: AnswerQuestionPayload) {
    const answer = Answer.create({
      content: payload.content,
      authorId: new UniqueEntityId(payload.instructorId),
      questionId: new UniqueEntityId(payload.questionId),
    });

    await this.answerRepository.create(answer);
    return answer;
  }
}
