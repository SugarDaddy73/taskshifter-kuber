using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.BusinessLogic.Models.Tasks.Request;

public sealed record RequestToCreateTask(
    [property: JsonIgnore]
    Guid ProjectId,

    [MinLength(2)]
    [MaxLength(255)]
    string Title,

    [MaxLength(2048)]
    string Description,

    TaskPriority Priority,
    DateTime? Deadline,

    [Range(0, 100)]
    int? EstimatedPoints,

    Guid? AssigneeId,
    Guid? ColumnId);
