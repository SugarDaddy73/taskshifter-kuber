import Logo from '../../../assets/TaskShifterLogo.svg';
import { useAuthStore } from "@/shared/lib/hooks/useAuthStore"
import { useUserProfile } from '@/shared/lib/hooks/useUserProfile';
import { useLogout } from '@/shared/lib/useLogout';
import { Button } from "@/shared/ui/Button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/Context-menu"
import UserSettingsDialog from './UserSettingsDialog';
import ChangePasswordDialog from './ChangePasswordDialog';
import { useState } from 'react';
import { Pencil, Lock, Undo2 } from 'lucide-react';

const Header = () => {
  const { isAuthenticated } = useAuthStore();
  const { user, isLoading } = useUserProfile();
  const logout = useLogout();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    isAuthenticated ? (
      <header className="h-[49px] flex w-full justify-between text-[26px] font-sans font-bold py-[0.5rem] px-[116px] bg-white">
        <img className='select-none' draggable='false' src={Logo} alt="TaskShifter Logo" />
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Button variant={'link'} className="bg-transparent text-black flex items-center leading-none px-4 py-2 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              const event = new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: e.clientX,
                clientY: e.clientY,
              });
              e.currentTarget.dispatchEvent(event);
            }}>
              {isLoading ? "Loading..." : user?.username || "User"}
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setIsProfileDialogOpen(true)} className='hover:cursor-pointer'>
              <Pencil size={16} color='black' />
              Edit Profile
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setIsPasswordDialogOpen(true)} className='hover:cursor-pointer'>
              <Lock size={16} color='black' />
              Change Password
            </ContextMenuItem>
            <ContextMenuItem className='text-red-500 hover:cursor-pointer focus:text-red-500' onClick={logout}>
              <Undo2 size={16} color='red' />
              Log Out
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        
        <UserSettingsDialog 
          isOpen={isProfileDialogOpen} 
          onOpenChange={setIsProfileDialogOpen} 
        />
        
        <ChangePasswordDialog 
          isOpen={isPasswordDialogOpen} 
          onOpenChange={setIsPasswordDialogOpen} 
        />
      </header>
    ) : (
      <header className="h-[49px] flex w-full justify-stretch text-[26px] font-sans font-bold py-[0.5rem] px-[116px] bg-white">
        <img className='select-none' draggable='false' src={Logo} alt="TaskShifter Logo" />
      </header>
    )
  );
};

export default Header;