import { Either, right } from '@/core/types/either'

import { UniqueIdentifier } from '@/core/entities/value-objects/unique-identifier'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface CreateQuestionUseCaseRequest {
  title: string
  authorId: string
  content: string
  attachmentIds?: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async execute({
    title,
    content,
    authorId,
    attachmentIds = [],
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueIdentifier(authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(attachmentIds)

    const questionAttachments = attachmentIds.map((questionAttachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueIdentifier(questionAttachmentId),
        questionId: question.id,
      })
    })

    console.log(questionAttachments)

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
