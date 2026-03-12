import { useQuery, useQueryClient } from 'react-query';
import { useUserStore } from '@/entities/user/lib/hooks/useUserStore';
import { useAuthStore } from '@/shared/lib/hooks/useAuthStore';
import { UserService } from '@/entities/user/api/UserService';

export const useUserProfile = () => {
  const setProfile = useUserStore((state) => state.setProfile);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await UserService.getCurrentUserProfile();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    onSuccess: (data) => {
      setProfile(data);
    },
    onError: (error) => {
      console.error('Failed to load user profile:', error);
      setProfile(undefined);
    },
  });

  const invalidateUserProfile = () => {
    queryClient.invalidateQueries(['userProfile']);
  };

  const updateUserProfile = (newData: any) => {
    queryClient.setQueryData(['userProfile'], newData);
    setProfile(newData);
  };

  return {
    user,
    isLoading,
    error,
    invalidateUserProfile,
    updateUserProfile,
  };
};