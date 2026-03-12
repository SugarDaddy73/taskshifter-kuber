import type { UserModel } from "./UserModel";

export interface MemberModel extends UserModel {
  role: number;
}