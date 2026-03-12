using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.BusinessLogic.Models.Users;

public sealed record UserProjectModel(
    Guid Id,
    string Email,
    string Username,
    string FullName)
{
    public Role Role { get; set; } = Role.Member;

    public static UserProjectModel From(UserEntity entity)
    {
        return new UserProjectModel(
            entity.Id,
            entity.Email,
            entity.Username,
            entity.FullName);
    }

    public static UserProjectModel From(UserDetailedModel detailedModel)
    {
        return new UserProjectModel(
            detailedModel.Id,
            detailedModel.Email,
            detailedModel.Username,
            detailedModel.FullName);
    }
}
