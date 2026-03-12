import type { CommentModel } from '@/entities/comment/model/CommentModel';

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  deadline?: string; // Змінено на optional (undefined)
  estimatedPoints?: number; // Змінено на optional (undefined)
  assigneeId?: string; // Змінено на optional (undefined)
  projectId: string;
  columnId?: string; // Змінено на optional (undefined)
  priority: number;
  creationDate: Date;
  updateDate?: Date;
  lastMovedDate?: Date;
  comments: CommentModel[];
}