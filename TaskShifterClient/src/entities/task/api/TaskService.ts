import type { AxiosResponse } from "axios";
import type { TaskModel } from "../model/TaskModel";
import { $api } from "../../../shared/api";

export class TaskService {
  static async createTask(
    projectId: string, 
    title: string, 
    description: string, 
    priority: number, 
    deadline?: string, 
    estimatedPoints?: number, 
    assigneeId?: string, 
    columnId?: string
  ): Promise<AxiosResponse<TaskModel>> {
    // Конвертуємо 0 в undefined для estimatedPoints
    const processedEstimatedPoints = estimatedPoints === 0 ? undefined : estimatedPoints;
    
    return $api.post(`/projects/${projectId}/tasks`, { 
      title, 
      description, 
      priority, 
      deadline, 
      estimatedPoints: processedEstimatedPoints, 
      assigneeId, 
      columnId 
    });
  }

  static async updateTask(
    projectId: string, 
    taskId: string, 
    title: string, 
    description: string, 
    priority: number, 
    deadline?: string, 
    estimatedPoints?: number, 
    assigneeId?: string, 
    columnId?: string
  ): Promise<AxiosResponse<void>> {
    // Конвертуємо 0 в undefined для estimatedPoints
    const processedEstimatedPoints = estimatedPoints === 0 ? undefined : estimatedPoints;
    
    return $api.put(`/projects/${projectId}/tasks/${taskId}`, { 
      title, 
      description, 
      priority, 
      deadline, 
      estimatedPoints: processedEstimatedPoints, 
      assigneeId, 
      columnId 
    });
  }

  static async deleteTask(projectId: string, taskId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/projects/${projectId}/tasks/${taskId}`);
  }
}