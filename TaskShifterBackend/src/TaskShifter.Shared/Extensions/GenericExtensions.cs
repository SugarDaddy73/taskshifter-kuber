using TaskShifter.Shared.Results;

namespace TaskShifter.Shared.Extensions;

public static class GenericExtensions
{
    /// <summary>
    /// Converts an object to a Result if it is not null, otherwise returns null.
    /// </summary>
    public static Result<T>? AsResultOrNull<T>(this T? @object) where T : class
    {
        if (@object is null)
        {
            return null;
        }

        return @object;
    }

    /// <summary>
    /// Converts an object to a Result.
    /// </summary>
    /// <exception cref="ArgumentNullException">Thrown if the object is null.</exception>
    public static Result<T> AsResult<T>(this T @object) where T : class
    {
        ArgumentNullException.ThrowIfNull(@object);
        return new Result<T>(@object);
    }
}
