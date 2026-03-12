import type { AxiosResponse } from "axios";
import type { UserModel } from "../model/UserModel";
import { $api } from "@/shared/api";

export class UserService {
  static async getCurrentUserProfile(): Promise<AxiosResponse<UserModel>> {
    return $api.get<UserModel>("/users/profile");
  }

  static async updateCurrentUserProfile(email: string, username: string, fullName: string): Promise<AxiosResponse<void>> {
    return $api.put("/users/profile", { email, username, fullName });
  }

  static async getUserProfileById(userId: string): Promise<AxiosResponse<UserModel>> {
    return $api.get<UserModel>(`/users/profile/${userId}`);
  }

  static async updateCurrentUserPassword(currentPassword: string, newPassword: string): Promise<AxiosResponse<void>> {
    return $api.put(`/users/password`, { currentPassword, newPassword });
  }
}