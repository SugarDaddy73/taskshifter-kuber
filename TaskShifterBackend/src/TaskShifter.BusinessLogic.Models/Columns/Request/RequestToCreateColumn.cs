using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskShifter.BusinessLogic.Models.Columns.Request;

public sealed record RequestToCreateColumn(
    [property: JsonIgnore]
    Guid ProjectId,

    [MinLength(2)]
    [MaxLength(255)]
    string Name,

    [Range(0, int.MaxValue)]
    int Color,

    [Range(0, int.MaxValue)]
    int? TaskLimit);
