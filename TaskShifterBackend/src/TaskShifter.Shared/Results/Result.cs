namespace TaskShifter.Shared.Results;

public class Result<T>
{
    public Error Error { get; init; } = null!;
    public T Value { get; init; } = default!;

    public bool IsSuccess { get; init; }
    public bool IsFailure => !IsSuccess;

    public Result(T value)
    {
        IsSuccess = true;
        Value = value;
    }

    public Result(Error error)
    {
        IsSuccess = false;
        Error = error;
    }

    public static implicit operator Result<T>(T value) => new(value);
    public static implicit operator Result<T>(Error error) => new(error);
}

public class Result : Result<Unit>
{
    public Result() : base(default(Unit))
    {
    }

    public Result(Error error) : base(error)
    {
    }

    public static Result Success => new();

    public static implicit operator Result(Unit unit) => new();
    public static implicit operator Result(Error error) => new(error);
}
