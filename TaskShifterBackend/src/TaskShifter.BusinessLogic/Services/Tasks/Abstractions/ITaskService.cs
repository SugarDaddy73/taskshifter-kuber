using TaskShifter.BusinessLogic.Models.Tasks;
using TaskShifter.BusinessLogic.Models.Tasks.Request;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Tasks.Abstractions;

public interface ITaskService
{
    Task<Result<TaskModel>> CreateTaskAsync(
        IssuerContext issuerContext,
        RequestToCreateTask request,
        CancellationToken ct = default);

    Task<Result> UpdateTaskAsync(
        IssuerContext issuerContext,
        RequestToUpdateTask request,
        CancellationToken ct = default);

    Task<Result> DeleteTaskAsync(
        IssuerContext issuerContext,
        RequestToDeleteTask request,
        CancellationToken ct = default);
}
