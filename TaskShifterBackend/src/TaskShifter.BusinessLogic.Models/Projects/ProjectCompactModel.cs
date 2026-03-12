using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.BusinessLogic.Models.Projects;

public sealed record ProjectCompactModel(
    Guid Id,
    string Name,
    IEnumerable<UserProjectModel> Members)
{
    public static ProjectCompactModel From(ProjectEntity entity)
    {
        return new ProjectCompactModel(
            entity.Id,
            entity.Name,
            entity.Members.Select(UserProjectModel.From).ToArray());
    }
}
