namespace TaskShifter.BusinessLogic.Models.Columns.Request;

public sealed record RequestToDeleteColumn(
    Guid ProjectId,
    Guid ColumnId);
