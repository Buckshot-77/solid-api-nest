import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class QuestionCommentPresenter {
  static toHTTP(questionComment: QuestionComment) {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      preview: questionComment.preview,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
