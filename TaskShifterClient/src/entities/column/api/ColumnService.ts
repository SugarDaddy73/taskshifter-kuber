import type { ColumnModel } from "../model/ColumnModel";
import { $api } from "@/shared/api";
import type { AxiosResponse } from "axios";

export class ColumnService {
    static async createColumn(projectId: string, name: string, color: number, taskLimit?: number): Promise<AxiosResponse<ColumnModel>> {
        return $api.post(`/projects/${projectId}/columns`, { name, color, taskLimit });
    }

    static async updateColumn(projectId: string, columnId: string, name: string, color: number, taskLimit?: number): Promise<AxiosResponse<void>> {
        return $api.put(`/projects/${projectId}/columns/${columnId}`, { name, color, taskLimit });
    }

    static async deleteColumn(projectId: string, columnId: string): Promise<AxiosResponse<void>> {
        return $api.delete(`/projects/${projectId}/columns/${columnId}`);
    }
    
    static async moveLeft(projectId: string, columnId: string): Promise<AxiosResponse<void>> {
        return $api.post(`/projects/${projectId}/columns/${columnId}/move-left`);
    }

    static async moveRight(projectId: string, columnId: string): Promise<AxiosResponse<void>> {
        return $api.post(`/projects/${projectId}/columns/${columnId}/move-right`);
    }
}