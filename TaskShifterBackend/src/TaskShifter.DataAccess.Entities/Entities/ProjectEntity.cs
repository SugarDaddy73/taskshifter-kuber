using System.ComponentModel.DataAnnotations;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;

namespace TaskShifter.DataAccess.Entities.Entities;

public sealed class ProjectEntity : IEntity, IHasId
{
    public Guid Id { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = null!;

    public ICollection<ColumnEntity> Columns { get; set; } = [];

    public ICollection<TaskEntity> Tasks { get; set; } = [];

    public ICollection<UserEntity> Members { get; set; } = [];
}
