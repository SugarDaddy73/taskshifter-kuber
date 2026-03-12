import { useQueryClient } from "react-query";
import { useAuthStore } from "./hooks/useAuthStore";
import { useProjectStore } from "@/entities/project/lib/hooks/useProjectStore";
import { useUserStore } from "@/entities/user/lib/hooks/useUserStore";

export const useLogout = () => {
  const setUnauthenticated = useAuthStore(state => state.setUnauthenticated);
  const setProjects = useProjectStore(state => state.setProjects);
  const setProfile = useUserStore(state => state.setProfile);
  const queryClient = useQueryClient();
  
  const logOut = () => {
    setUnauthenticated();
    queryClient.clear();
    queryClient.removeQueries();
    setProjects([]);
    setProfile(undefined);
  }

  return logOut;
}