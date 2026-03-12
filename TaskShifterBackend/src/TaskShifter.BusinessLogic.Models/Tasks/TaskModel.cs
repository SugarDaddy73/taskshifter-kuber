using TaskShifter.BusinessLogic.Models.Comments;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.BusinessLogic.Models.Tasks;

public sealed record TaskModel(
    Guid Id,
    string Title,
    string Description,
    DateTime? Deadline,
    int? EstimatedPoints,
    Guid? AssigneeId,
    Guid ProjectId,
    Guid? ColumnId,
    TaskPriority Priority,
    DateTime CreationDate,
    DateTime? UpdateDate,
    DateTime? LastMovedDate,
    IEnumerable<CommentModel> Comments)
{
    public TaskEntity ToEntity()
    {
        return new TaskEntity
        {
            Id = Id,
            Title = Title,
            Description = Description,
            Deadline = Deadline,
            EstimatedPoints = EstimatedPoints,
            AssigneeId = AssigneeId,
            ProjectId = ProjectId,
            ColumnId = ColumnId,
            Priority = Priority,
            CreationDate = CreationDate,
            UpdateDate = UpdateDate,
            LastMovedDate = LastMovedDate,
            Comments = Comments.Select(c => c.ToEntity()).ToList(),
        };
    }

    public static TaskModel From(TaskEntity entity)
    {
        return new TaskModel(
            entity.Id,
            entity.Title,
            entity.Description,
            entity.Deadline,
            entity.EstimatedPoints,
            entity.AssigneeId,
            entity.ProjectId,
            entity.ColumnId,
            entity.Priority,
            entity.CreationDate,
            entity.UpdateDate,
            entity.LastMovedDate,
            entity.Comments.Select(CommentModel.From).ToList());
    }
}
