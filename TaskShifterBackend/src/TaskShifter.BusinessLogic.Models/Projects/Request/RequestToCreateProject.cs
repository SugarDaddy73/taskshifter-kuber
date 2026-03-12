using System.ComponentModel.DataAnnotations;

namespace TaskShifter.BusinessLogic.Models.Projects.Request;

public sealed record RequestToCreateProject(
    [MinLength(2)]
    [MaxLength(255)]
    string Name);
