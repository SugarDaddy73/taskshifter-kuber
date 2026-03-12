namespace TaskShifter.BusinessLogic.Models.Tasks.Request;

public sealed record RequestToDeleteTask(
    Guid ProjectId,
    Guid TaskId);
