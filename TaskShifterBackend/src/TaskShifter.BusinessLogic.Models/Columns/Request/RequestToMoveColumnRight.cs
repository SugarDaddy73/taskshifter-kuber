namespace TaskShifter.BusinessLogic.Models.Columns.Request;

public sealed record RequestToMoveColumnRight(
    Guid ProjectId,
    Guid ColumnId);
