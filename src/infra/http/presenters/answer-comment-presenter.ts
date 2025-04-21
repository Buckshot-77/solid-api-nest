import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentPresenter {
  static toHTTP(answerComment: AnswerComment) {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      preview: answerComment.preview,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
