using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskShifter.BusinessLogic.Models.Projects.Request;

public sealed record RequestToUpdateProject(
    [property: JsonIgnore]
    Guid ProjectId,

    [MinLength(2)]
    [MaxLength(255)]
    string Name);
