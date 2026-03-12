import type { AxiosResponse } from "axios";
import type { CommentModel } from "../model/CommentModel";
import { $api } from "../../../shared/api";

export class CommentService {
  static async createComment(projectId: string, taskId: string, content: string): Promise<AxiosResponse<CommentModel>> {
    return $api.post(`/projects/${projectId}/tasks/${taskId}/comments`, { content });
  }

  static async updateComment(projectId: string, taskId: string, commentId: string, content: string): Promise<AxiosResponse<void>> {
    return $api.put(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, { content });
  }

  static async deleteComment(projectId: string, taskId: string, commentId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
  }
}