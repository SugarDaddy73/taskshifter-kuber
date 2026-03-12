using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;

namespace TaskShifter.DataAccess.Entities.Entities;

public sealed class CommentEntity : IEntity, IHasId
{
    public Guid Id { get; set; }

    [ForeignKey(nameof(Author))]
    public Guid AuthorId { get; set; }

    [ForeignKey(nameof(Task))]
    public Guid TaskId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    public DateTime? UpdateDate { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public UserEntity Author { get; set; } = null!;

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public TaskEntity Task { get; set; } = null!;
}
