using System.ComponentModel.DataAnnotations;

namespace TaskShifter.BusinessLogic.Options;

internal sealed class TokenOptions
{
    [Required]
    public required string AccessTokenSigningKey { get; set; }

    [Required]
    public required int AccessTokenExpiryInSeconds { get; set; }
}
