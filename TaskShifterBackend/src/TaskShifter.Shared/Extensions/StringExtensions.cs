using TaskShifter.Shared.Utils;

namespace TaskShifter.Shared.Extensions;

public static class StringExtensions
{
    public static bool EqualsIgnoreCase(this string firstValue, string secondValue)
    {
        return firstValue.Equals(secondValue, StringComparison.InvariantCultureIgnoreCase);
    }

    public static string ToSha256(this string value)
    {
        return HashUtil.ToSha256(value);
    }

    public static string Truncate(this string value, int maxLength)
    {
        return value.Substring(0, maxLength);
    }
}
