using System.ComponentModel.DataAnnotations;

namespace TaskShifter.BusinessLogic.Models.Users.Request;

public sealed record RequestToLogin(
    [EmailAddress]
    string Email,
    string Password);
