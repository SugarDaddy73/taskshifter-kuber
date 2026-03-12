using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.DataAccess.Entities.Entities;

public sealed class UserToProjectEntity : IEntity
{
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(Project))]
    public Guid ProjectId { get; set; }

    public Role Role { get; set; } = Role.Member;

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public UserEntity User { get; set; } = null!;

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public ProjectEntity Project { get; set; } = null!;
}
