import React, { useState } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Separator } from '@/shared/ui/separator';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/Context-menu";
import { useDroppable } from '@dnd-kit/core';
import type { ColumnModel } from '@/entities/column/model/ColumnModel';
import type { TaskModel } from '@/entities/task/model/TaskModel';
import { TaskCard } from '@/entities/task/ui/TaskCard';
import { decimalToHex, useAdaptiveTextColor } from '@/shared/lib/colorUtils';
import { ColumnService } from '../api/ColumnService';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { ProjectService } from '@/entities/project/api/ProjectService';
import { EditColumnDialog } from './EditColumnDialog';
import { DeleteColumnDialog } from './DeleteColumnDialog';
import { CreateTaskDialog } from '@/entities/task/ui/CreateTaskDialog'; // Додано імпорт
import { toast } from 'sonner';

interface ColumnProps {
  column: ColumnModel;
  tasks: TaskModel[];
}

export const Column: React.FC<ColumnProps> = ({ column, tasks = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false); // Додано стан
  const { setSelectedProject, selectedProject } = useProjectStore();
  
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const columnColorHex = decimalToHex(column.color);
  const adaptiveTextColor = useAdaptiveTextColor(columnColorHex);
  
  const taskCount = tasks.length;
  const hasTaskLimit = column.taskLimit !== undefined && column.taskLimit > 0;
  const isFull = hasTaskLimit && taskCount >= (column.taskLimit || 0);

  const refreshProjectData = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await ProjectService.getProjectById(selectedProject.id);
      setSelectedProject(response.data);
    } catch (error) {
      console.error("Failed to refresh project data:", error);
    }
  };

  const handleMoveLeft = async (e: Event) => {
    e.preventDefault();
    try {
      await ColumnService.moveLeft(selectedProject!.id, column.id);
      await refreshProjectData();
      toast.success("Success!", { description: "Column moved left." });
    } catch (error) {
      toast.error("Error!", { description: "Failed to move column." });
      console.error("Move column error:", error);
    }
  };

  const handleMoveRight = async (e: Event) => {
    e.preventDefault();
    try {
      await ColumnService.moveRight(selectedProject!.id, column.id);
      await refreshProjectData();
      toast.success("Success!", { description: "Column moved right." });
    } catch (error) {
      toast.error("Error!", { description: "Failed to move column." });
      console.error("Move column error:", error);
    }
  };

  const handleEditClick = (e: Event) => {
    e.preventDefault();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: Event) => {
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleAddTaskClick = () => {
    setIsCreateTaskDialogOpen(true);
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        className="w-80 bg-slate-50 rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[656px] transition-colors hover:bg-[#F2F5F8]"
        style={{
          borderColor: isOver ? columnColorHex : '#e5e7eb',
          backgroundColor: isOver ? `${columnColorHex}20` : '#f8fafc',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Column Header with Context Menu */}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div 
              className="rounded-t-lg transition-colors"
              style={{
                backgroundColor: isFull 
                  ? columnColorHex 
                  : isHovered 
                    ? '#F2F5F8' 
                    : '#f8fafc'
              }}
            >
              <div 
                className="rounded-md transition-colors m-4"
                style={{
                  backgroundColor: isFull ? columnColorHex : 'white'
                }}
              >
                <div className="flex items-center justify-between p-3">
                  {/* Circle with count */}
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors shrink-0"
                    style={{
                      backgroundColor: isFull ? 'white' : columnColorHex,
                      color: isFull ? 'rgb(17, 24, 39)' : adaptiveTextColor
                    }}
                  >
                    {taskCount}
                    {hasTaskLimit && `/${column.taskLimit}`}
                  </div>
                  
                  {/* Column name with truncation */}
                  <h3 
                    className="font-semibold flex-1 mx-3 transition-colors truncate"
                    style={{
                      color: isFull ? adaptiveTextColor : 'rgb(17, 24, 39)'
                    }}
                    title={column.name}
                  >
                    {column.name}
                  </h3>
                  
                  {/* Three dots menu */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 transition-colors shrink-0"
                    style={{
                      color: isFull ? adaptiveTextColor : 'rgb(156, 163, 175)',
                    }}
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
                    }}
                  >
                    <MoreHorizontal size={16}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem 
              className='hover:cursor-pointer'
              onSelect={handleEditClick}
            >
              <Pencil color='black' size={16} className="mr-2" />
              Edit column
            </ContextMenuItem>
            <ContextMenuItem 
              className='hover:cursor-pointer'
              onSelect={handleMoveLeft}
            >
              <ArrowLeft color='black' size={16} className="mr-2" />
              Move left
            </ContextMenuItem>
            <ContextMenuItem 
              className='hover:cursor-pointer'
              onSelect={handleMoveRight}
            >
              <ArrowRight color='black' size={16} className="mr-2" />
              Move right
            </ContextMenuItem>
            <ContextMenuItem 
              className='hover:cursor-pointer text-red-500 focus:text-red-500'
              onSelect={handleDeleteClick}
            >
              <Trash2 color='red' size={16} className="mr-2" />
              Delete column
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {!isFull && (
          <div className="flex items-center gap-2.5 px-4">
            <div 
              className="h-1 rounded-full shrink-0"
              style={{ 
                width: '30%',
                backgroundColor: columnColorHex
              }}
            />
            <Separator className="flex-1" />
          </div>
        )}

        {/* Tasks Container */}
        <div className="flex-1 px-4 py-4 space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm">No tasks</p>
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <div className="p-4 border-t border-gray-200 min-h-[69px] flex items-center">
          {isHovered && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              onClick={handleAddTaskClick}
            >
              <Plus size={16} className="mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <EditColumnDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        column={column}
        projectId={selectedProject?.id || ''}
        onColumnUpdated={refreshProjectData}
      />

      <DeleteColumnDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        column={column}
        projectId={selectedProject?.id || ''}
        onColumnDeleted={refreshProjectData}
      />

      <CreateTaskDialog
        isOpen={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
        projectId={selectedProject?.id || ''}
        defaultColumnId={column.id}
      />
    </>
  );
};