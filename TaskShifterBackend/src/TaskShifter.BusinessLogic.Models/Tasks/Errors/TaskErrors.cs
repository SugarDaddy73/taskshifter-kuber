using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Models.Tasks.Errors;

public static class TaskErrors
{
    public static class Codes
    {
        public const string TaskNotFound = "TASK_NOT_FOUND";
        public const string TaskCannotBeAddedToColumn = "TASK_CANNOT_BE_ADDED_TO_COLUMN";
    }

    public static Error NotFound => new(
        Codes.TaskNotFound,
        "Task has not been found");

    public static Error CannotBeAddedToColumn => new(
        Codes.TaskCannotBeAddedToColumn,
        "Task cannot be added to the specified column");
}
