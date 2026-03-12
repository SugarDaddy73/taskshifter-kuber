namespace TaskShifter.BusinessLogic.Models.Columns.Request;

public sealed record RequestToMoveColumnLeft(
    Guid ProjectId,
    Guid ColumnId);
