using System.ComponentModel.DataAnnotations;

namespace TaskShifter.BusinessLogic.Models.Users.Request;

public sealed record RequestToUpdatePassword(
    string CurrentPassword,

    [MinLength(2)]
    [MaxLength(255)]
    string NewPassword);
