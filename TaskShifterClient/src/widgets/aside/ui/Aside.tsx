// Aside.tsx
import React, { useState } from 'react';
import { ProjectTab } from '@/entities/project/ui/ProjectTab';
import { useFetchProjects } from '@/pages/dashboard/lib/hooks/useFetchProjects';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import type { ProjectModel } from '@/entities/project/model/ProjectModel';
import { Button } from '@/shared/ui/Button';
import { Plus } from 'lucide-react';
import { Separator } from '@/shared/ui/separator';
import { CreateProjectDialog } from './CreateProjectDialog';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area'

export const Aside: React.FC = () => {
  const { projects, isLoading } = useFetchProjects();
  const { selectedProjectId, setSelectedProject, setSelectedProjectId } = useProjectStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleProjectClick = (project: ProjectModel) => {
    setSelectedProject(project);
    setSelectedProjectId(project.id);
    console.log('Project selected:', project.name);
  };

  const handleCreateProjectClick = () => {
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <aside className="w-64 bg-white p-4 h-screen sticky top-0">
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-64 bg-white p-4 h-full sticky top-0 space-y-2.5 overflow-y-auto">
        <div className="flex flex-row gap-2 items-center">
          <Button 
            onClick={handleCreateProjectClick}
            className="bg-white h-7 w-7 border-slate-200 border rounded-md p-0 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <Plus color='black' size={16} />
          </Button>
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        </div>
        <Separator />      
        <ScrollArea className='h-170'>
          <div className="space-y-2 pr-2.5">
            {projects?.map((project) => (
              <ProjectTab
                key={project.id}
                project={project}
                isSelected={selectedProjectId === project.id}
                onClick={handleProjectClick}
              />
            ))}
            
            {(!projects || projects.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <div className="mb-2">😔</div>
                <p className="text-sm">No projects</p>
                <p className="text-xs text-gray-400 mt-1">Create your first project</p>
              </div>
            )}
          </div>
          <ScrollBar orientation='vertical' />
        </ScrollArea>
      </aside>

      <CreateProjectDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
};