import { create } from "zustand";
import type { ProjectModel } from "../../model/ProjectModel";
import { devtools } from "zustand/middleware";

interface ProjectStore {
  projects: ProjectModel[];
  setProjects: (projects: ProjectModel[]) => void;
  selectedProject: ProjectModel | undefined;
  setSelectedProject: (project: ProjectModel | undefined) => void;
  selectedProjectId: string | undefined;
  setSelectedProjectId: (projectId: string | undefined) => void;
}

export const useProjectStore = create<ProjectStore>()(
  devtools((set) => ({
    projects: [],
    setProjects: (projects: ProjectModel[]) => {
      set({ projects });
    },
    selectedProject: undefined,
    setSelectedProject: (selectedProject: ProjectModel | undefined) => {
      set({ selectedProject });
    },
    selectedProjectId: undefined,
    setSelectedProjectId: (selectedProjectId: string | undefined) => {
      set({ selectedProjectId });
    },
  }), { name: "ProjectStore" })
);