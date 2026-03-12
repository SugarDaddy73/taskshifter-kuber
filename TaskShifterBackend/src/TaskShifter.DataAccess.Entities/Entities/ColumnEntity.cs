using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;

namespace TaskShifter.DataAccess.Entities.Entities;

public sealed class ColumnEntity : IEntity, IHasId
{
    public Guid Id { get; set; }

    [ForeignKey(nameof(Project))]
    public Guid ProjectId { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = null!;

    public int Color { get; set; }

    public int? TaskLimit { get; set; }

    public int? Order { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public ProjectEntity Project { get; set; } = null!;

    public ICollection<TaskEntity> Tasks { get; set; } = [];
}
