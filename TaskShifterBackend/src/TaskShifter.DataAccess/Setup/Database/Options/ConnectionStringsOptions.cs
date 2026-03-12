using System.ComponentModel.DataAnnotations;

namespace TaskShifter.DataAccess.Setup.Database.Options;

internal sealed record ConnectionStringsOptions
{
    [Required]
    public required string DefaultConnection { get; set; }
}
