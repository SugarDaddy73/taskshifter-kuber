using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.BusinessLogic.Models.Users;

public sealed record UserPublicModel(
    Guid Id,
    string Email,
    string Username,
    string FullName)
{
    public static UserPublicModel From(UserEntity entity)
    {
        return new UserPublicModel(
            entity.Id,
            entity.Email,
            entity.Username,
            entity.FullName);
    }

    public static UserPublicModel From(UserDetailedModel detailedModel)
    {
        return new UserPublicModel(
            detailedModel.Id,
            detailedModel.Email,
            detailedModel.Username,
            detailedModel.FullName);
    }
}
