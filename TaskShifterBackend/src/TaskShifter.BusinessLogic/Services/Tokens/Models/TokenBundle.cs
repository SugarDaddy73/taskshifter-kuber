namespace TaskShifter.BusinessLogic.Services.Tokens.Models;

public sealed record TokenBundle(
    string AccessToken,
    int ExpiresIn);
