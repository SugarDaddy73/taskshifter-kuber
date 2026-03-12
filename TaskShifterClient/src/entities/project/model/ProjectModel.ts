import type { ColumnModel } from "@/entities/column/model/ColumnModel";
import type { TaskModel } from "@/entities/task/model/TaskModel";
import type { MemberModel } from "@/entities/user/model/MemberModel";

export interface ProjectModel {
    id: string;
    name: string;
    columns: ColumnModel[];
    tasks: TaskModel[];
    members: MemberModel[];
}