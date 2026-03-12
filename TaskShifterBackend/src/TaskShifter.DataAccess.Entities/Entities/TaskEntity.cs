using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.DataAccess.Entities.Entities;

public sealed class TaskEntity : IEntity, IHasId
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? Deadline { get; set; }

    public int? EstimatedPoints { get; set; }

    [ForeignKey(nameof(Assignee))]
    public Guid? AssigneeId { get; set; }

    [ForeignKey(nameof(Project))]
    public Guid ProjectId { get; set; }

    [ForeignKey(nameof(Column))]
    public Guid? ColumnId { get; set; }

    public TaskPriority Priority { get; set; }

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    public DateTime? UpdateDate { get; set; }

    public DateTime? LastMovedDate { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    public UserEntity? Assignee { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public ProjectEntity Project { get; set; } = null!;

    [DeleteBehavior(DeleteBehavior.SetNull)]
    public ColumnEntity? Column { get; set; }

    public ICollection<CommentEntity> Comments { get; set; } = [];
}
