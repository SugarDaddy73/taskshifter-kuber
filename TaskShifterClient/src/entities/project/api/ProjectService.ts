import type { AxiosResponse } from "axios";
import type { ProjectModel } from "../model/ProjectModel";
import { $api } from "@/shared/api";

export class ProjectService {
  static async getProjectList(): Promise<AxiosResponse<ProjectModel[]>> {
    return $api.get<ProjectModel[]>("/projects");
  }

  static async createProject(name: string): Promise<AxiosResponse<ProjectModel>> {
    return $api.post("/projects", { name });
  }

  static async getProjectById(projectId: string): Promise<AxiosResponse<ProjectModel>> {
    return $api.get<ProjectModel>(`/projects/${projectId}`);
  }

  static async updateProject(projectId: string, name: string): Promise<AxiosResponse<void>> {
    return $api.put(`/projects/${projectId}`, { name });
  }

  static async deleteProject(projectId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/projects/${projectId}`);
  }

  static async addMemberToProject(projectId: string, email: string): Promise<AxiosResponse<void>> {
    return $api.post(`/projects/${projectId}/members`, { email });
  }

  static async removeMemberFromProject(projectId: string, userId: string): Promise<AxiosResponse<void>> {
    return $api.delete(`/projects/${projectId}/members/${userId}`);
  }

  static async updateMemberRole(projectId: string, userId: string, newRole: number): Promise<AxiosResponse<void>> {
    return $api.put(`/projects/${projectId}/members/${userId}/role`, { newRole });
  }

  static async leaveProject(projectId: string): Promise<AxiosResponse<void>> {
    return $api.post(`/projects/${projectId}/leave`);
  }
}