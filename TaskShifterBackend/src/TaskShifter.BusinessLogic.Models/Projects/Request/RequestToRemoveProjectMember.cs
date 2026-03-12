namespace TaskShifter.BusinessLogic.Models.Projects.Request;

public sealed record RequestToRemoveProjectMember(
    Guid ProjectId,
    Guid UserId);
