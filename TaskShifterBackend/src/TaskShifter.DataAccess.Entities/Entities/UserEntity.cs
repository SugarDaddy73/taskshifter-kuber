using System.ComponentModel.DataAnnotations;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;

namespace TaskShifter.DataAccess.Entities.Entities;

public sealed class UserEntity : IEntity, IHasId
{
    public Guid Id { get; set; }

    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [MaxLength(255)]
    public string Username { get; set; } = null!;

    [MaxLength(255)]
    public string FullName { get; set; } = null!;

    [MaxLength(255)]
    public string PasswordHash { get; set; } = null!;

    public ICollection<ProjectEntity> Projects { get; set; } = [];
}
