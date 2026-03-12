using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.BusinessLogic.Models.Columns;

public sealed record ColumnModel(
    Guid Id,
    string Name,
    Guid ProjectId,
    int Color,
    int? TaskLimit,
    int? Order)
{
    public ColumnEntity ToEntity()
    {
        return new ColumnEntity
        {
            Id = Id,
            Name = Name,
            ProjectId = ProjectId,
            Color = Color,
            TaskLimit = TaskLimit,
            Order = Order,
        };
    }

    public static ColumnModel From(ColumnEntity entity)
    {
        return new ColumnModel(
            entity.Id,
            entity.Name,
            entity.ProjectId,
            entity.Color,
            entity.TaskLimit,
            entity.Order);
    }
}
