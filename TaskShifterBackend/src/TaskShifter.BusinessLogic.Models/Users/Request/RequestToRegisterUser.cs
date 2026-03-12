using System.ComponentModel.DataAnnotations;

namespace TaskShifter.BusinessLogic.Models.Users.Request;

public sealed record RequestToRegisterUser(
    [EmailAddress]
    string Email,

    [MinLength(2)]
    [RegularExpression("^[a-zA-Z0-9]+$")]
    string Username,

    [MinLength(2)]
    [MaxLength(255)]
    string FullName,

    [MinLength(2)]
    [MaxLength(255)]
    string Password);
