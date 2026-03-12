export interface CommentModel {
  id: string;
  authorId: string;
  taskId: string;
  content: string;
  creationDate: Date;
  updateDate: Date | undefined;
}