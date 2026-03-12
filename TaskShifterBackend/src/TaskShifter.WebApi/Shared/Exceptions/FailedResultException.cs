using TaskShifter.Shared.Results;

namespace TaskShifter.WebApi.Shared.Exceptions;

public class FailedResultException(Error error) : Exception(error.Message)
{
    public Error Error => error;
}
