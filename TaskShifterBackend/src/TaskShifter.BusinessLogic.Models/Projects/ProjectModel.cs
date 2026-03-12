using TaskShifter.BusinessLogic.Models.Columns;
using TaskShifter.BusinessLogic.Models.Tasks;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.BusinessLogic.Models.Projects;

public sealed record ProjectModel(
    Guid Id,
    string Name,
    IEnumerable<ColumnModel> Columns,
    IEnumerable<TaskModel> Tasks,
    IEnumerable<UserProjectModel> Members)
{
    public ProjectEntity ToEntity()
    {
        return new ProjectEntity
        {
            Id = Id,
            Name = Name,
            Columns = Columns.Select(c => c.ToEntity()).ToList(),
            Tasks = Tasks.Select(t => t.ToEntity()).ToList(),
            Members = Members.Select(m => new UserEntity { Id = m.Id }).ToList(),
        };
    }

    public static ProjectModel From(ProjectEntity entity)
    {
        return new ProjectModel(
            entity.Id,
            entity.Name,
            entity.Columns.Select(ColumnModel.From).ToArray(),
            entity.Tasks.Select(TaskModel.From).ToArray(),
            entity.Members.Select(UserProjectModel.From).ToArray());
    }
}
