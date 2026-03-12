using TaskShifter.BusinessLogic.Models.Projects;
using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.BusinessLogic.Models.Users;

public sealed record UserDetailedModel(
    Guid Id,
    string Email,
    string Username,
    string FullName,
    string PasswordHash,
    IEnumerable<ProjectModel> Projects)
{
    public UserEntity ToEntity()
    {
        return new UserEntity
        {
            Id = Id,
            Email = Email,
            Username = Username,
            FullName = FullName,
            PasswordHash = PasswordHash,
            Projects = Projects.Select(p => p.ToEntity()).ToList(),
        };
    }

    public static UserDetailedModel From(UserEntity entity)
    {
        return new UserDetailedModel(
            entity.Id,
            entity.Email,
            entity.Username,
            entity.FullName,
            entity.PasswordHash,
            entity.Projects.Select(ProjectModel.From).ToArray());
    }
}
