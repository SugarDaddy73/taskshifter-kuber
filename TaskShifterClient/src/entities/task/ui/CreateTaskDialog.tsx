// entities/task/ui/CreateTaskDialog.tsx
import React, { useState } from 'react';
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import { Separator } from "@/shared/ui/separator";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Label } from "@/shared/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/Select";
import { Calendar } from "@/shared/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { CalendarIcon, Flag, User, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/shared/lib/utils";
import { TaskService } from '../api/TaskService';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
  defaultColumnId?: string;
}

export function CreateTaskDialog({ 
  isOpen, 
  onOpenChange, 
  projectId,
  defaultColumnId
}: CreateTaskDialogProps) {
  const { selectedProject, setSelectedProject } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('1'); // Default to Medium
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [estimatedPoints, setEstimatedPoints] = useState('');
  const [assigneeId, setAssigneeId] = useState('unassigned');
  const [columnId, setColumnId] = useState(defaultColumnId || 'unassigned');

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('1');
      setDeadline(undefined);
      setEstimatedPoints('');
      setAssigneeId('unassigned');
      setColumnId(defaultColumnId || 'unassigned');
    }
  }, [isOpen, defaultColumnId]);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Error!", { description: "Title is required." });
      return;
    }

    if (columnId === 'unassigned') {
      toast.error("Error!", { description: "Please select a column." });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for creation - конвертуємо спеціальні значення назад в undefined
      const createData = {
        title: title.trim(),
        description: description.trim(),
        priority: parseInt(priority),
        deadline: deadline ? deadline.toISOString() : undefined,
        estimatedPoints: estimatedPoints ? parseInt(estimatedPoints) : undefined,
        assigneeId: assigneeId !== 'unassigned' ? assigneeId : undefined,
        columnId: columnId !== 'unassigned' ? columnId : undefined
      };

      const response = await TaskService.createTask(
        projectId,
        createData.title,
        createData.description,
        createData.priority,
        createData.deadline,
        createData.estimatedPoints,
        createData.assigneeId,
        createData.columnId
      );

      // Update local state with new task
      if (selectedProject) {
        const newTask = response.data;
        setSelectedProject({
          ...selectedProject,
          tasks: [...selectedProject.tasks, newTask]
        });
      }

      toast.success("Success!", { description: "Task created successfully." });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to create task:', error);
      
      if (error.response?.data.code === "VALIDATION_ERROR") {
        toast.error("Error!", { 
          description: "Validation error. Please check the task data." 
        });
      } else if (error.response?.data.code === "COLUMN_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Selected column not found." 
        });
      } else if (error.response?.data.code === "USER_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Selected assignee not found." 
        });
      } else if (error.response?.data.code === "COLUMN_LIMIT_EXCEEDED") {
        toast.error("Error!", { 
          description: "Column has reached its task limit." 
        });
      } else {
        toast.error("Error!", { 
          description: error.response?.data.message || "Failed to create task." 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    onOpenChange(false);
  };

  const priorityOptions = [
    { value: '0', label: 'Low', color: 'text-green-600' },
    { value: '1', label: 'Medium', color: 'text-yellow-600' },
    { value: '2', label: 'High', color: 'text-orange-600' },
    { value: '3', label: 'Urgent', color: 'text-red-600' },
  ];

  const getPriorityIcon = (priorityValue: string) => {
    const option = priorityOptions.find(opt => opt.value === priorityValue);
    return <Flag className={cn("h-4 w-4", option?.color)} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-4">
        <DialogTitle className="text-xl flex justify-center">Create New Task</DialogTitle>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(priority)}
                      {priorityOptions.find(opt => opt.value === priority)?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Flag className={cn("h-4 w-4", option.color)} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {deadline && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeadline(undefined)}
                  className="h-auto p-0 text-xs text-red-600 hover:text-red-700"
                >
                  Clear deadline
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedPoints">Estimated Points</Label>
              <div className="relative">
                <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="estimatedPoints"
                  type="number"
                  min="1"
                  max="100"
                  value={estimatedPoints}
                  onChange={(e) => setEstimatedPoints(e.target.value)}
                  placeholder="0-100"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {assigneeId !== 'unassigned' ? (
                        selectedProject?.members?.find(m => m.id === assigneeId)?.username || 'Unknown'
                      ) : (
                        'Unassigned'
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {selectedProject?.members?.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {member.username} ({member.fullName})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="column">Column *</Label>
              <Select value={columnId} onValueChange={setColumnId}>
                <SelectTrigger>
                  <SelectValue>
                    {columnId !== 'unassigned' ? (
                      selectedProject?.columns?.find(c => c.id === columnId)?.name || 'Unknown'
                    ) : (
                      'Select a column'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {selectedProject?.columns
                    ?.sort((a, b) => a.order - b.order)
                    .map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-4">
          <Button 
            onClick={handleCancelClick} 
            className="flex-1" 
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            className="flex-1" 
            disabled={isLoading || !title.trim() || columnId === 'unassigned'}
          >
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}