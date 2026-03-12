using System.Text.Json.Serialization;

namespace TaskShifter.BusinessLogic.Models.Comments.Request;

public sealed record RequestToDeleteComment(
    [property: JsonIgnore]
    Guid ProjectId,

    [property: JsonIgnore]
    Guid TaskId,

    Guid CommentId);
