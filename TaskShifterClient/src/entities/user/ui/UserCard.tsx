import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Trash2, Crown, User, Shield, LogOut } from 'lucide-react';
import type { MemberModel } from '@/entities/user/model/MemberModel';
import { ChangeRoleDialog } from './ChangeRoleDialog';
import { RemoveMemberDialog } from './RemoveMemberDialog';
import { LeaveProjectDialog } from './LeaveProjectDialog';
import { useUserStore } from '@/entities/user/lib/hooks/useUserStore';

interface UserCardProps {
  member: MemberModel;
  projectId: string;
  currentUserRole: number;
  onMemberUpdated: () => void;
  onUserLeftProject?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  member, 
  projectId, 
  currentUserRole,
  onMemberUpdated,
  onUserLeftProject 
}) => {
  const { profile: currentUser } = useUserStore();
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const isCurrentUser = member.id === currentUser?.id;

  const getRoleInfo = (role: number) => {
    switch (role) {
      case 2:
        return { name: 'Owner', icon: Crown, color: 'text-yellow-600' };
      case 1:
        return { name: 'Admin', icon: Shield, color: 'text-blue-600' };
      case 0:
        return { name: 'Member', icon: User, color: 'text-gray-600' };
      default:
        return { name: 'Member', icon: User, color: 'text-gray-600' };
    }
  };

  const { name: roleName, icon: RoleIcon, color: roleColor } = getRoleInfo(member.role);

  const isOwner = member.role === 2;
  const canModify = currentUserRole >= 1;
  const canChangeRole = canModify && !isOwner && !isCurrentUser;
  const canRemove = canModify && !isOwner && !isCurrentUser;
  const canLeave = isCurrentUser && !isOwner;

  const handleLeftProject = () => {
    onUserLeftProject?.();
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {member.fullName}
              {isCurrentUser && <span className="text-blue-600 text-sm ml-2">(You)</span>}
            </h3>
            <div className={`flex items-center gap-1 text-sm ${roleColor}`}>
              <RoleIcon size={16} />
              <span>{roleName}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <div>@{member.username}</div>
            <div className="text-gray-500">{member.email}</div>
          </div>
        </div>

        {isCurrentUser ? (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={!canLeave}
              onClick={() => setIsLeaveDialogOpen(true)}
            >
              <LogOut size={16} className="mr-2" />
              Leave Project
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={!canChangeRole}
              onClick={() => setIsChangeRoleDialogOpen(true)}
            >
              Change Role
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={!canRemove}
              onClick={() => setIsRemoveDialogOpen(true)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      <ChangeRoleDialog
        isOpen={isChangeRoleDialogOpen}
        onOpenChange={setIsChangeRoleDialogOpen}
        member={member}
        projectId={projectId}
        currentRole={member.role}
        onRoleChanged={onMemberUpdated}
      />

      <RemoveMemberDialog
        isOpen={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        member={member}
        projectId={projectId}
        onMemberRemoved={onMemberUpdated}
      />

      <LeaveProjectDialog
        isOpen={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        projectId={projectId}
        projectName={projectId}
        onLeftProject={handleLeftProject}
      />
    </>
  );
};