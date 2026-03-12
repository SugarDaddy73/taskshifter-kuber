import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UserModel } from "../../model/UserModel";

interface UserStore {
  profile: UserModel | undefined;
  setProfile: (profile: UserModel | undefined) => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      profile: undefined,
      setProfile: (profile: UserModel | undefined) => {
        set({ profile });
      }
    }),
    { name: "UserStore" }
  )
);