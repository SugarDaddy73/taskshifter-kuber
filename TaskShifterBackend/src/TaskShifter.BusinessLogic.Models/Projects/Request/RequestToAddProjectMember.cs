using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskShifter.BusinessLogic.Models.Projects.Request;

public sealed record RequestToAddProjectMember(
    [property: JsonIgnore]
    Guid ProjectId,

    [EmailAddress]
    string Email);
