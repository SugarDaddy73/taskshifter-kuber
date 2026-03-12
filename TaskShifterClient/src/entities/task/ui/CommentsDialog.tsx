import { useState, useEffect } from 'react';
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Separator } from "@/shared/ui/separator";
import { Textarea } from "@/shared/ui/Textarea";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { MoreHorizontal, Send, Pencil, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import type { TaskModel } from '@/entities/task/model/TaskModel';
import type { CommentModel } from '@/entities/comment/model/CommentModel';
import { CommentService } from '@/entities/comment/api/CommentService';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { useUserStore } from '@/entities/user/lib/hooks/useUserStore';
import { toast } from 'sonner';

interface CommentsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: TaskModel;
  projectId: string;
}

export function CommentsDialog({ isOpen, onOpenChange, task, projectId }: CommentsDialogProps) {
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { profile: currentUser } = useUserStore();
  const [comments, setComments] = useState<CommentModel[]>(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<CommentModel | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setComments(task.comments || []);
    }
  }, [isOpen, task]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await CommentService.createComment(projectId, task.id, newComment.trim());
      const updatedComments = [...comments, response.data];
      setComments(updatedComments);
      setNewComment('');
      
      // Оновлюємо локальний стан
      updateLocalTaskComments(updatedComments);
      
      toast.success("Success!", { description: "Comment added successfully." });
    } catch (error: any) {
      console.error('Failed to add comment:', error);
      toast.error("Error!", { 
        description: error.response?.data.message || "Failed to add comment." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (comment: CommentModel) => {
    if (!editContent.trim()) return;

    setIsLoading(true);
    try {
      await CommentService.updateComment(projectId, task.id, comment.id, editContent.trim());
      const updatedComments = comments.map(c =>
        c.id === comment.id ? { ...c, content: editContent.trim(), updateDate: new Date() } : c
      );
      setComments(updatedComments);
      setEditingComment(null);
      setEditContent('');
      
      // Оновлюємо локальний стан
      updateLocalTaskComments(updatedComments);
      
      toast.success("Success!", { description: "Comment updated successfully." });
    } catch (error: any) {
      console.error('Failed to edit comment:', error);
      toast.error("Error!", { 
        description: error.response?.data.message || "Failed to edit comment." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (comment: CommentModel) => {
    setIsLoading(true);
    try {
      await CommentService.deleteComment(projectId, task.id, comment.id);
      const updatedComments = comments.filter(c => c.id !== comment.id);
      setComments(updatedComments);
      
      // Оновлюємо локальний стан
      updateLocalTaskComments(updatedComments);
      
      toast.success("Success!", { description: "Comment deleted successfully." });
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      toast.error("Error!", { 
        description: error.response?.data.message || "Failed to delete comment." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalTaskComments = (updatedComments: CommentModel[]) => {
    if (selectedProject) {
      const updatedTasks = selectedProject.tasks.map(t =>
        t.id === task.id ? { ...t, comments: updatedComments } : t
      );
      setSelectedProject({
        ...selectedProject,
        tasks: updatedTasks
      });
    }
  };

  const startEditing = (comment: CommentModel) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const getAuthorName = (authorId: string) => {
    const member = selectedProject?.members?.find(m => m.id === authorId);
    return member?.username || 'Unknown User';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy \'at\' HH:mm');
  };

  const isCurrentUserAuthor = (authorId: string) => {
    return currentUser?.id === authorId;
  };

  const canManageComment = (comment: CommentModel) => {
    return isCurrentUserAuthor(comment.authorId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-4 max-h-[80vh] flex flex-col">
        <DialogTitle className="text-xl flex justify-center">Comments</DialogTitle>
        <Separator />
        <DialogDescription>
          Comments for task: <strong>{task.title}</strong>
        </DialogDescription>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-2xl mb-2">💬</div>
              <p>No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {getAuthorName(comment.authorId)}
                        {isCurrentUserAuthor(comment.authorId) && (
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.creationDate)}
                        {comment.updateDate && comment.updateDate !== comment.creationDate && (
                          <span> • edited {formatDate(comment.updateDate)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Comment Actions Popover */}
                  {canManageComment(comment) && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => startEditing(comment)}
                          >
                            <Pencil size={14} className="mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteComment(comment)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Comment Content */}
                {editingComment?.id === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditComment(comment)}
                        disabled={isLoading || !editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-20 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <div className="border-t pt-4">
          <Label htmlFor="new-comment" className="mb-2 block">Add Comment</Label>
          <div className="flex gap-2">
            <Textarea
              id="new-comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="resize-none flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Press Ctrl+Enter to send
            </p>
            <Button
              onClick={handleAddComment}
              disabled={isLoading || !newComment.trim()}
              className="flex items-center gap-2"
            >
              <Send size={16} />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}