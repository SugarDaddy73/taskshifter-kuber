// widgets/undistributed/ui/UndistributedSheet.tsx
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/Button";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { TaskCard } from "@/entities/task/ui/TaskCard";
import { useProjectStore } from "@/entities/project/lib/hooks/useProjectStore";
import { List } from 'lucide-react';
import { Badge } from "@/shared/ui/Badge";

export function UndistributedSheet() {
  const { selectedProject } = useProjectStore();
  const [isOpen, setIsOpen] = React.useState(false);

  // Отримуємо таски без колонки
  const undistributedTasks = selectedProject?.tasks?.filter(task => !task.columnId) || [];

  if (!selectedProject) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2"
        >
          <List size={16} />
          <span>Undistributed</span>
          {undistributedTasks.length > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gray-700 text-white"
            >
              {undistributedTasks.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 sm:w-[480px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <List size={20} />
            Undistributed Tasks
          </SheetTitle>
          <p className="text-sm text-gray-600 mt-1">
            {undistributedTasks.length} task{undistributedTasks.length !== 1 ? 's' : ''} without column
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {undistributedTasks.length > 0 ? (
                <div className="space-y-3">
                  {undistributedTasks.map((task) => (
                    <div key={task.id} className="min-w-0">
                      <TaskCard task={task} hideDragHandle={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <List size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No undistributed tasks</h3>
                  <p className="text-sm text-gray-600">
                    All tasks are assigned into columns.
                  </p>
                </div>
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}