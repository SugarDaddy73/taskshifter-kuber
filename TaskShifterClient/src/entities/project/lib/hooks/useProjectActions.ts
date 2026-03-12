import { useFetchProjects } from '@/pages/dashboard/lib/hooks/useFetchProjects';
import { useProjectStore } from './useProjectStore';

export const useProjectActions = () => {
  const { refetch } = useFetchProjects();
  const { setSelectedProject, setSelectedProjectId } = useProjectStore();

  const refreshProjects = async () => {
    await refetch();
  };

  const clearSelectedProject = () => {
    setSelectedProject(undefined);
    setSelectedProjectId(undefined);
  };

  return {
    refreshProjects,
    clearSelectedProject,
  };
};