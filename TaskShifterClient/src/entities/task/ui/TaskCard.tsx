import React, { useState } from 'react';
import { Calendar, User, Flag, BarChart3, MessageSquare, Pencil, Trash2, GripVertical } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/Context-menu";
import { Separator } from '@/shared/ui/separator';
import { useDraggable } from '@dnd-kit/core';
import type { TaskModel } from '@/entities/task/model/TaskModel';
import { decimalToHex } from '@/shared/lib/colorUtils';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { useUserStore } from '@/entities/user/lib/hooks/useUserStore';
import { EditTaskDialog } from './EditTaskDialog';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { CommentsDialog } from './CommentsDialog';

interface TaskCardProps {
  task: TaskModel;
  hideDragHandle?: boolean; // Додатковий пропс для приховування ручки драга, якщо потрібно
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const { selectedProject } = useProjectStore();
  const { profile: currentUser } = useUserStore();
  
  // Робимо таску draggable, але використовуємо окремий елемент для драга
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Знаходимо колонку для отримання кольору
  const column = selectedProject?.columns?.find(col => col.id === task.columnId);
  const columnColorHex = column ? decimalToHex(column.color) : '#6b7280';
  
  // Знаходимо призначеного користувача
  const assignee = task.assigneeId ? selectedProject?.members?.find(member => member.id === task.assigneeId) : undefined;
  
  // Форматуємо дедлайн з перевіркою на undefined
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return null;
    }
  };

  // Отримуємо колір для пріоритету
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 0: return 'text-green-600 bg-green-100';
      case 1: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-orange-600 bg-orange-100';
      case 3: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      case 3: return 'Urgent';
      default: return 'None';
    }
  };

  // Перевіряємо, чи потрібно показувати estimated points
  const shouldShowEstimatedPoints = task.estimatedPoints !== undefined && task.estimatedPoints !== null && task.estimatedPoints > 0;

  // Підраховуємо кількість коментарів
  const commentsCount = task.comments ? task.comments.length : 0;

  const handleEditClick = (e: Event) => {
    e.preventDefault();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: Event) => {
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleCommentsClick = () => {
    setIsCommentsDialogOpen(true);
  };

  const handleDescriptionClick = () => {
    setIsCommentsDialogOpen(true);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex min-h-[80px] max-w-full ${
              isDragging ? 'opacity-50 rotate-5' : ''
            }`}
          >
            {/* Thin color stripe on the left */}
            <div 
              className="w-1 rounded-l-lg flex-shrink-0"
              style={{ backgroundColor: columnColorHex }}
            />
            
            {/* Drag handle - тільки ця область драгається */}
            <div 
              {...listeners}
              {...attributes}
              className="flex items-center justify-center px-1 py-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <GripVertical size={14} className="text-gray-400" />
            </div>
            
            <div className="flex-1 px-2 py-2 min-w-0 max-w-full">
              {/* Header with title */}
              <div className="flex items-start justify-between mb-2">
                {/* Task title with proper text truncation */}
                <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 break-words flex-1 mr-2 min-w-0">
                  {task.title}
                </h4>
              </div>

              {/* Tags row - compact */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {/* Assignee */}
                {assignee && (
                  <div className="flex items-center gap-0.5 text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                    <User size={10} />
                    <span className="truncate max-w-12">{assignee.username}</span>
                    {currentUser?.id === assignee.id && (
                      <span className="text-[8px] text-blue-600 ml-0.5">(You)</span>
                    )}
                  </div>
                )}

                {/* Deadline */}
                {task.deadline && (
                  <div className="flex items-center gap-0.5 text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                    <Calendar size={10} />
                    <span>{formatDeadline(task.deadline)}</span>
                  </div>
                )}

                {/* Priority */}
                {task.priority !== undefined && (
                  <div className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                    <Flag size={10} />
                    <span>{getPriorityText(task.priority)}</span>
                  </div>
                )}

                {/* Story points - показуємо тільки якщо значення більше 0 */}
                {shouldShowEstimatedPoints && (
                  <div className="flex items-center gap-0.5 text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded flex-shrink-0">
                    <BarChart3 size={10} />
                    <span>{task.estimatedPoints}</span>
                  </div>
                )}

                {/* Comments count */}
                {commentsCount > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded flex-shrink-0">
                    <MessageSquare size={10} />
                    <span>{commentsCount}</span>
                  </div>
                )}
              </div>

              {/* Description or Comments button */}
              {task.description ? (
                <div className="mt-1">
                  <Separator className='mb-1.5' />
                  <button
                    onClick={handleDescriptionClick}
                    className="w-full text-left min-w-0 hover:bg-gray-50 rounded px-1 -mx-1 transition-colors"
                  >
                    <p className="text-xs text-gray-600 line-clamp-2 break-words hover:text-gray-800 transition-colors leading-relaxed max-w-full">
                      {task.description}
                    </p>
                  </button>
                </div>
              ) : (
                <div className="mt-1">
                  <Separator className='mb-1.5' />
                  <button
                    onClick={handleCommentsClick}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition-colors py-1 w-full justify-start hover:bg-gray-50 rounded px-1 -mx-1"
                  >
                    <MessageSquare size={12} />
                    <span>Comments ({commentsCount})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent>
          <ContextMenuItem 
            className='hover:cursor-pointer'
            onSelect={handleEditClick}
          >
            <Pencil color='black' size={16} className="mr-2" />
            Edit task
          </ContextMenuItem>
          <ContextMenuItem 
            className='hover:cursor-pointer text-red-500 focus:text-red-500'
            onSelect={handleDeleteClick}
          >
            <Trash2 color='red' size={16} className="mr-2" />
            Delete task
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Dialogs */}
      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={task}
        projectId={selectedProject?.id || ''}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        task={task}
        projectId={selectedProject?.id || ''}
      />

      <CommentsDialog
        isOpen={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
        task={task}
        projectId={selectedProject?.id || ''}
      />
    </>
  );
};