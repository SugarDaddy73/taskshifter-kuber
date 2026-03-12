using TaskShifter.Shared.Results;
using TaskShifter.WebApi.Shared.Exceptions;

namespace TaskShifter.WebApi.Shared.Extensions;

internal static class ResultExtensions
{
    /// <summary>
    /// Throws a <see cref="FailedResultException"/> when a Result indicates failure.
    /// Otherwise, returns the Result's value.
    /// </summary>
    /// <remarks>
    /// IMPORTANT: This method should only be used in:
    /// - Presentation layer (Endpoints)
    ///
    /// This method SHOULD NOT BE USED in other layers or internal logic. Using it extensively
    /// would force implementation of multiple try-catch blocks to handle specific errors,
    /// which defeats the purpose of the Result pattern.
    /// </remarks>
    /// <exception cref="FailedResultException">Thrown when Result.IsFailure is true</exception>
    public static T UnwrapOrThrow<T>(this Result<T> result)
    {
        if (result.IsFailure)
        {
            throw new FailedResultException(result.Error);
        }

        return result.Value;
    }

    /// <summary>
    /// Asynchronous version of <see cref="UnwrapOrThrow{T}(Result{T})"/>.
    /// </summary>
    public static async Task<T> UnwrapOrThrow<T>(this Task<Result<T>> taskResult)
    {
        Result<T> result = await taskResult;

        if (result.IsFailure)
        {
            throw new FailedResultException(result.Error);
        }

        return result.Value;
    }

    /// <summary>
    /// Asynchronous version of <see cref="UnwrapOrThrow{T}(Result{T})"/>.
    /// </summary>
    public static async Task UnwrapOrThrow(this Task<Result> taskResult)
    {
        Result result = await taskResult;

        if (result.IsFailure)
        {
            throw new FailedResultException(result.Error);
        }
    }

    /// <summary>
    /// Throws a <see cref="FailedResultException"/> when a Result indicates failure.
    /// Otherwise, returns the Result itself.
    /// /// </summary>
    /// <remarks>
    /// IMPORTANT: This method should only be used in:
    /// - Presentation layer (Endpoints)
    /// This method SHOULD NOT BE USED in other layers or internal logic. Using it extensively
    /// would force implementation of multiple try-catch blocks to handle specific errors,
    /// which defeats the purpose of the Result pattern.
    /// </remarks>
    public static Result ThrowIfFailure(this Result result)
    {
        if (result.IsFailure)
        {
            throw new FailedResultException(result.Error);
        }

        return result;
    }

    /// <summary>
    /// Asynchronous version of <see cref="ThrowIfFailure(Result)"/>.
    /// </summary>
    public static async Task<Result> ThrowIfFailure(this Task<Result> taskResult)
    {
        Result result = await taskResult;

        if (result.IsFailure)
        {
            throw new FailedResultException(result.Error);
        }

        return result;
    }
}
