import { $api } from '@/shared/api';
import { type AxiosResponse } from 'axios';
import type { AuthLoginResponse } from '../models/AuthLoginResponse';

export class AuthService {
  static async authenticate(email: string, password: string): Promise<AxiosResponse<AuthLoginResponse>> {
    return $api.post<string, AxiosResponse<AuthLoginResponse>>("/auth/login", { email, password });
  }

  static async register(email: string, username: string, fullName: string, password: string): Promise<AxiosResponse<AuthLoginResponse>> {
    return $api.post<string, AxiosResponse<AuthLoginResponse>>("/auth/register", { email, username, fullName, password });
  }
}