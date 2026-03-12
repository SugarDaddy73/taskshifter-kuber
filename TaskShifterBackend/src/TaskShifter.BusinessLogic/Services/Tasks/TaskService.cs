using TaskShifter.BusinessLogic.Models.Projects.Errors;
using TaskShifter.BusinessLogic.Models.Roles.Errors;
using TaskShifter.BusinessLogic.Models.Tasks;
using TaskShifter.BusinessLogic.Models.Tasks.Errors;
using TaskShifter.BusinessLogic.Models.Tasks.Request;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.BusinessLogic.Models.Users.Errors;
using TaskShifter.BusinessLogic.Services.Tasks.Abstractions;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Tasks;

public sealed class TaskService(IUnitOfWork unitOfWork) : ITaskService
{
    public async Task<Result<TaskModel>> CreateTaskAsync(IssuerContext issuerContext, RequestToCreateTask request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(issuerContext, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        if (request.ColumnId.HasValue)
        {
            Result<ColumnEntity> columnResult = await unitOfWork.ColumnRepository
                .GetFirstByFilterAsync(c => c.Id == request.ColumnId && c.ProjectId == request.ProjectId, ct: ct);

            if (columnResult.IsFailure) return columnResult.Error;

            // Check column task limit
            if (columnResult.Value.TaskLimit.HasValue)
            {
                Result<IEnumerable<TaskEntity>> tasksInColumnResult = await unitOfWork.TaskRepository
                    .GetManyByFilterAsync(t => t.ColumnId == request.ColumnId, ct: ct);

                if (tasksInColumnResult.IsFailure) return tasksInColumnResult.Error;

                if (tasksInColumnResult.Value.Count() >= columnResult.Value.TaskLimit)
                {
                    return TaskErrors.CannotBeAddedToColumn;
                }
            }
        }

        if (request.AssigneeId.HasValue)
        {
            Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, request.AssigneeId.Value, ct);
            if (roleResult.IsFailure && roleResult.Error.Code == RoleErrors.NotFound.Code) return UserErrors.NotFound;
            else if (roleResult.IsFailure) return roleResult.Error;
        }

        TaskEntity task = new()
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            Deadline = request.Deadline,
            EstimatedPoints = request.EstimatedPoints,
            AssigneeId = request.AssigneeId,
            ProjectId = request.ProjectId,
            ColumnId = request.ColumnId,
            CreationDate = DateTime.UtcNow,
        };

        Result<TaskEntity> addResult = await unitOfWork.TaskRepository.AddAsync(task, ct);
        if (addResult.IsFailure) return addResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return TaskModel.From(task);
    }

    public async Task<Result> UpdateTaskAsync(IssuerContext issuerContext, RequestToUpdateTask request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(issuerContext, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<TaskEntity> taskResult = await unitOfWork.TaskRepository
            .GetFirstByFilterAsync(t => t.Id == request.TaskId && t.ProjectId == request.ProjectId, ct: ct);

        if (taskResult.IsFailure) return taskResult.Error;

        if (request.ColumnId.HasValue && request.ColumnId != taskResult.Value.ColumnId)
        {
            Result<ColumnEntity> columnResult = await unitOfWork.ColumnRepository
                .GetFirstByFilterAsync(c => c.Id == request.ColumnId && c.ProjectId == request.ProjectId, ct: ct);

            if (columnResult.IsFailure) return columnResult.Error;

            // Check column task limit
            if (columnResult.Value.TaskLimit.HasValue)
            {
                Result<IEnumerable<TaskEntity>> tasksInColumnResult = await unitOfWork.TaskRepository
                    .GetManyByFilterAsync(t => t.ColumnId == request.ColumnId, ct: ct);

                if (tasksInColumnResult.IsFailure) return tasksInColumnResult.Error;

                if (tasksInColumnResult.Value.Count() >= columnResult.Value.TaskLimit)
                {
                    return TaskErrors.CannotBeAddedToColumn;
                }
            }
        }

        if (request.AssigneeId.HasValue)
        {
            Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(request.ProjectId, request.AssigneeId.Value, ct);
            if (roleResult.IsFailure && roleResult.Error.Code == RoleErrors.NotFound.Code) return UserErrors.NotFound;
            else if (roleResult.IsFailure) return roleResult.Error;
        }

        TaskEntity task = taskResult.Value;
        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.Deadline = request.Deadline;
        task.EstimatedPoints = request.EstimatedPoints;
        task.AssigneeId = request.AssigneeId;
        task.UpdateDate = DateTime.UtcNow;

        if (task.ColumnId != request.ColumnId)
        {
            task.ColumnId = request.ColumnId;
            task.LastMovedDate = DateTime.UtcNow;
        }

        Result updateResult = await unitOfWork.TaskRepository.UpdateAsync(task, ct);
        if (updateResult.IsFailure) return updateResult.Error;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    public async Task<Result> DeleteTaskAsync(IssuerContext issuerContext, RequestToDeleteTask request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(issuerContext, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<TaskEntity> taskResult = await unitOfWork.TaskRepository
            .GetFirstByFilterAsync(t => t.Id == request.TaskId && t.ProjectId == request.ProjectId, ct: ct);

        if (taskResult.IsFailure) return taskResult.Error;

        Result deleteResult = await unitOfWork.TaskRepository.DeleteByIdAsync(request.TaskId, ct);
        if (deleteResult.IsFailure) return deleteResult.Error;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    private async Task<Result> VerifyUserIsMemberOfProject(IssuerContext context, Guid projectId, CancellationToken ct = default)
    {
        Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(projectId, context.IssuerId, ct);
        if (roleResult.IsFailure && roleResult.Error.Code == RoleErrors.NotFound.Code) return ProjectErrors.NotFound;
        else if (roleResult.IsFailure) return roleResult.Error;

        return Result.Success;
    }
}
