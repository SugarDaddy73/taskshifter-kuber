using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskShifter.BusinessLogic.Models.Comments.Request;

public sealed record RequestToUpdateComment(
    [property: JsonIgnore]
    Guid ProjectId,

    [property: JsonIgnore]
    Guid TaskId,

    [property: JsonIgnore]
    Guid CommentId,

    [MinLength(2)]
    string Content);
