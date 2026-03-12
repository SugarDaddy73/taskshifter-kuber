import { useQuery } from "react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ProjectService } from "@/entities/project/api/ProjectService";
import { useProjectStore } from "@/entities/project/lib/hooks/useProjectStore";
import { useLogout } from "@/shared/lib/useLogout";

export const useFetchProjects = () => {
  const { setProjects } = useProjectStore();
  const logout = useLogout();

  const queryResult = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const response = await ProjectService.getProjectList();
        setProjects(response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;

        if (status === 401) {
          toast.error("Session expired. Please log in again.");
          logout();
          return [];
        } else {
          toast.error("Failed to fetch project list.");
          throw error;
        }
      }
    },
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    projects: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
    isError: queryResult.isError,
    error: queryResult.error,
  };
};