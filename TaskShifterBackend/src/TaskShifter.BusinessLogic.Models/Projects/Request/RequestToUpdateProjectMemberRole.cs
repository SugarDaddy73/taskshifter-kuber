using System.Text.Json.Serialization;
using TaskShifter.DataAccess.Entities.Entities.Enums;

namespace TaskShifter.BusinessLogic.Models.Projects.Request;

public sealed record RequestToUpdateProjectMemberRole(
    [property: JsonIgnore]
    Guid ProjectId,
    [property: JsonIgnore]
    Guid UserId,
    Role NewRole);
