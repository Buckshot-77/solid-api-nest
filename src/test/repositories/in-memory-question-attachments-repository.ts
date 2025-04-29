import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public questionAttachments: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.questionAttachments.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.questionAttachments = this.questionAttachments.filter((attachment) => {
      return !attachments.some((attachmentInsideSome) =>
        attachmentInsideSome.equals(attachment),
      )
    })
  }

  public async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.questionAttachments.filter(
      (attachment) => questionId === attachment.questionId,
    )
  }

  public async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) => {
        return questionAttachment.questionId !== questionId
      },
    )

    this.questionAttachments = questionAttachments
  }
}
