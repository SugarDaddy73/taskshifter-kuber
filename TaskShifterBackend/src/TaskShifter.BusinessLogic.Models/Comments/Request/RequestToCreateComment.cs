using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskShifter.BusinessLogic.Models.Comments.Request;

public sealed record RequestToCreateComment(
    [property: JsonIgnore]
    Guid ProjectId,

    [property: JsonIgnore]
    Guid TaskId,

    [MinLength(2)]
    string Content);
