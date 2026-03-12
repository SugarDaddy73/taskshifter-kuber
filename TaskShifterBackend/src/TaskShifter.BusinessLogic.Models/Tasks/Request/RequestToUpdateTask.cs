using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.BusinessLogic.Models.Tasks.Request;

public sealed record RequestToUpdateTask(
    [property: JsonIgnore]
    Guid ProjectId,

    [property: JsonIgnore]
    Guid TaskId,

    [MinLength(2)]
    [MaxLength(255)]
    string Title,

    [MaxLength(2048)]
    string Description,
    TaskPriority Priority,
    DateTime? Deadline,

    [Range(1, 100)]
    int? EstimatedPoints,

    Guid? AssigneeId,
    Guid? ColumnId);
