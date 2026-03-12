import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { Column } from '@/entities/column/ui/Column';
import { CreateColumnDialog } from '@/entities/column/ui/CreateColumnDialog';
import { UndistributedSheet } from '@/widgets/undistributed/ui/UndistributedSheet'; 
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskService } from '@/entities/task/api/TaskService';
import { TaskCard } from '@/entities/task/ui/TaskCard';
import type { TaskModel } from '@/entities/task/model/TaskModel';
import { toast } from 'sonner';

export const Board: React.FC = () => {
  const { selectedProject, setSelectedProject } = useProjectStore();
  const [isCreateColumnDialogOpen, setIsCreateColumnDialogOpen] = React.useState(false);
  const [activeTask, setActiveTask] = React.useState<TaskModel | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Project Selected</h2>
          <p className="text-gray-500">Please select a project from the sidebar to get started</p>
        </div>
      </div>
    );
  }

  const columns = selectedProject.columns || [];
  const tasks = selectedProject.tasks || [];
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newColumnId = over.id as string;

    const task = tasks.find(t => t.id === taskId);
    const currentColumn = columns.find(col => col.id === task?.columnId);
    
    // Якщо задача вже в цій колонці або це та сама колонка - виходимо
    if (!task || currentColumn?.id === newColumnId) return;

    try {
      // Конвертуємо 0 в undefined для estimatedPoints
      const estimatedPoints = task.estimatedPoints === 0 ? undefined : task.estimatedPoints;
      
      // Конвертуємо null в undefined для deadline
      const deadline = task.deadline || undefined;
      
      // Підготовка даних для оновлення
      const updateData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: deadline,
        estimatedPoints: estimatedPoints,
        assigneeId: task.assigneeId,
        columnId: newColumnId
      };

      // Оновлюємо задачу на сервері
      await TaskService.updateTask(
        selectedProject.id,
        taskId,
        updateData.title,
        updateData.description,
        updateData.priority,
        updateData.deadline,
        updateData.estimatedPoints,
        updateData.assigneeId,
        updateData.columnId
      );

      // Оновлюємо локальний стан
      const updatedTasks = tasks.map(t =>
        t.id === taskId ? { 
          ...t, 
          columnId: newColumnId,
          updateDate: new Date()
        } : t
      );
      
      setSelectedProject({
        ...selectedProject,
        tasks: updatedTasks
      });

      toast.success("Success!", { description: "Task moved successfully." });

    } catch (error: any) {
      console.error('Failed to move task:', error);
      
      if (error.response?.data.code === "VALIDATION_ERROR") {
        toast.error("Error!", { 
          description: "Validation error. Please check the task data." 
        });
      } else if (error.response?.data.code === "TASK_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Task not found." 
        });
      } else if (error.response?.data.code === "COLUMN_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Target column not found." 
        });
      } else if (error.response?.data.code === "COLUMN_LIMIT_EXCEEDED") {
        toast.error("Error!", { 
          description: "Target column has reached its task limit." 
        });
      } else {
        toast.error("Error!", { 
          description: error.response?.data.message || "Failed to move task." 
        });
      }
    }
  };

  return (
    <div className="flex-1 bg-white overflow-auto">
      {/* Header with project name and buttons */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
          <p className="text-gray-600 mt-1">
            {sortedColumns.length} column{sortedColumns.length !== 1 ? 's' : ''} • {' '}
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Buttons Container */}
        <div className="flex items-center gap-3">
          {/* Undistributed Tasks Button */}
          <UndistributedSheet />
          
          {/* Add Column Button */}
          <Button
            onClick={() => setIsCreateColumnDialogOpen(true)}
          className="pl-2 pr-3.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2"
          >
            <Plus size={20} className="text-gray-600" />
          <span className='text-slate-900'>Add Column</span>
          </Button>
        </div>
      </div>

      {/* Columns area with DnD */}
      <div className="relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-6 pb-4 px-6">
              <SortableContext 
                items={sortedColumns.map(col => col.id)} 
                strategy={horizontalListSortingStrategy}
              >
                {sortedColumns.map((column) => (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks.filter(task => task.columnId === column.id)}
                  />
                ))}
              </SortableContext>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <DragOverlay>
            {activeTask ? (
              <div className="opacity-80 transform rotate-5">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Create Column Dialog */}
      <CreateColumnDialog
        isOpen={isCreateColumnDialogOpen}
        onOpenChange={setIsCreateColumnDialogOpen}
        projectId={selectedProject.id}
      />
    </div>
  );
};