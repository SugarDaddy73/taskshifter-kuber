using TaskShifter.BusinessLogic.Models.Columns;
using TaskShifter.BusinessLogic.Models.Columns.Request;
using TaskShifter.BusinessLogic.Models.Projects.Errors;
using TaskShifter.BusinessLogic.Models.Roles.Errors;
using TaskShifter.BusinessLogic.Models.Users;
using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataAccess.Entities.Entities.Enums;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Services.Columns.Abstractions;

public sealed class ColumnService(IUnitOfWork unitOfWork) : IColumnService
{
    /// <summary>
    /// Creates default columns for a new project.
    /// </summary>
    public async Task<Result> CreateDefaultColumnsAsync(RequestToCreateDefaultColumns request, CancellationToken ct = default)
    {
        var defaultColumns = new[]
        {
            new ColumnEntity
            {
                Id = Guid.NewGuid(),
                ProjectId = request.ProjectId,
                Name = "To Do",
                Color = 35036, // "#0088DC"
                Order = 0,
            },
            new ColumnEntity
            {
                Id = Guid.NewGuid(),
                ProjectId = request.ProjectId,
                Name = "In Progress",
                Color = 16042518, // "#F4CA16"
                Order = 1,
            },
            new ColumnEntity
            {
                Id = Guid.NewGuid(),
                ProjectId = request.ProjectId,
                Name = "Done",
                Color = 12442199, // "#BDDA57"
                Order = 2,
            },
        };

        foreach (ColumnEntity column in defaultColumns)
        {
            Result<ColumnEntity> addResult = await unitOfWork.ColumnRepository.AddAsync(column, ct);
            if (addResult.IsFailure) return addResult.Error;
        }

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    /// <summary>
    /// Creates a new column within a specified project.
    /// </summary>
    public async Task<Result<ColumnModel>> CreateColumnAsync(IssuerContext context, RequestToCreateColumn request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(context, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<IEnumerable<ColumnEntity>> columnsResult = await unitOfWork.ColumnRepository
            .GetManyByFilterAsync(c => c.ProjectId == request.ProjectId, ct: ct);

        if (columnsResult.IsFailure) return columnsResult.Error;

        int maxOrder;
        if (columnsResult.Value.Any()) maxOrder = columnsResult.Value.Max(c => c.Order) ?? 0;
        else maxOrder = -1;

        ColumnEntity newColumn = new()
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId,
            Name = request.Name,
            Color = request.Color,
            TaskLimit = request.TaskLimit,
            Order = maxOrder + 1,
        };

        Result<ColumnEntity> addResult = await unitOfWork.ColumnRepository.AddAsync(newColumn, ct);
        if (addResult.IsFailure) return addResult.Error;

        await unitOfWork.SaveChangesAsync(ct);

        return ColumnModel.From(addResult.Value);
    }

    /// <summary>
    /// Updates the details of an existing column.
    /// </summary>
    public async Task<Result> UpdateColumnAsync(IssuerContext context, RequestToUpdateColumn request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(context, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<ColumnEntity> columnResult = await unitOfWork.ColumnRepository
            .GetFirstByFilterAsync(c => c.Id == request.ColumnId && c.ProjectId == request.ProjectId, ct: ct);

        if (columnResult.IsFailure) return columnResult.Error;

        ColumnEntity column = columnResult.Value;
        column.Name = request.Name;
        column.Color = request.Color;
        column.TaskLimit = request.TaskLimit;

        Result updateResult = await unitOfWork.ColumnRepository.UpdateAsync(column, ct);
        if (updateResult.IsFailure) return updateResult.Error;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    /// <summary>
    /// Moves a column one position to the left within its project.
    /// </summary>
    public async Task<Result> MoveColumnLeftAsync(IssuerContext context, RequestToMoveColumnLeft request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(context, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<IEnumerable<ColumnEntity>> columnsResult = await unitOfWork.ColumnRepository
            .GetManyByFilterAsync(c => c.ProjectId == request.ProjectId, ct: ct);

        if (columnsResult.IsFailure) return columnsResult.Error;

        var columns = columnsResult.Value.OrderBy(c => c.Order).ToList();
        ColumnEntity? currentColumn = columns.FirstOrDefault(c => c.Id == request.ColumnId);

        if (currentColumn == null) return Result.Success;
        if (currentColumn.Order == 0) return Result.Success; // Already leftmost

        ColumnEntity? leftColumn = columns.FirstOrDefault(c => c.Order == currentColumn.Order - 1);
        if (leftColumn != null)
        {
            leftColumn.Order++;
            currentColumn.Order--;

            await unitOfWork.ColumnRepository.UpdateAsync(leftColumn, ct);
            await unitOfWork.ColumnRepository.UpdateAsync(currentColumn, ct);
            await unitOfWork.SaveChangesAsync(ct);
        }

        return Result.Success;
    }

    /// <summary>
    /// Moves a column one position to the right within its project.
    /// </summary>
    public async Task<Result> MoveColumnRightAsync(IssuerContext context, RequestToMoveColumnRight request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(context, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<IEnumerable<ColumnEntity>> columnsResult = await unitOfWork.ColumnRepository
            .GetManyByFilterAsync(c => c.ProjectId == request.ProjectId, ct: ct);

        if (columnsResult.IsFailure) return columnsResult.Error;

        var columns = columnsResult.Value.OrderBy(c => c.Order).ToList();
        ColumnEntity? currentColumn = columns.FirstOrDefault(c => c.Id == request.ColumnId);

        if (currentColumn == null) return Result.Success;
        if (currentColumn.Order == columns.Count - 1) return Result.Success; // Already rightmost

        ColumnEntity? rightColumn = columns.FirstOrDefault(c => c.Order == currentColumn.Order + 1);
        if (rightColumn != null)
        {
            rightColumn.Order--;
            currentColumn.Order++;

            await unitOfWork.ColumnRepository.UpdateAsync(rightColumn, ct);
            await unitOfWork.ColumnRepository.UpdateAsync(currentColumn, ct);
            await unitOfWork.SaveChangesAsync(ct);
        }

        return Result.Success;
    }

    /// <summary>
    /// Deletes a column and reorders the remaining columns in the project.
    /// </summary>
    public async Task<Result> DeleteColumnAsync(IssuerContext context, RequestToDeleteColumn request, CancellationToken ct = default)
    {
        Result verifyResult = await VerifyUserIsMemberOfProject(context, request.ProjectId, ct);
        if (verifyResult.IsFailure) return verifyResult.Error;

        Result<ColumnEntity> columnResult = await unitOfWork.ColumnRepository
            .GetFirstByFilterAsync(c => c.Id == request.ColumnId && c.ProjectId == request.ProjectId, ct: ct);

        if (columnResult.IsFailure) return columnResult.Error;

        Result deleteResult = await unitOfWork.ColumnRepository.DeleteByIdAsync(request.ColumnId, ct);
        if (deleteResult.IsFailure) return deleteResult.Error;

        Result<IEnumerable<ColumnEntity>> columnsResult = await unitOfWork.ColumnRepository
            .GetManyByFilterAsync(c => c.ProjectId == request.ProjectId && c.Id != request.ColumnId, ct: ct);
        if (columnsResult.IsFailure) return columnsResult.Error;

        // Reorder remaining columns
        var columns = columnsResult.Value.OrderBy(c => c.Order).ToList();
        for (int i = 0; i < columns.Count; i++)
        {
            columns[i].Order = i;
            await unitOfWork.ColumnRepository.UpdateAsync(columns[i], ct);
        }

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }

    /// <summary>
    /// Verifies if the user is a member of the specified project.
    /// </summary>
    private async Task<Result> VerifyUserIsMemberOfProject(IssuerContext context, Guid projectId, CancellationToken ct = default)
    {
        Result<Role> roleResult = await unitOfWork.RoleRepository.GetUserRoleAsync(projectId, context.IssuerId, ct);
        if (roleResult.IsFailure && roleResult.Error.Code == RoleErrors.NotFound.Code) return ProjectErrors.NotFound;
        else if (roleResult.IsFailure) return roleResult.Error;

        return Result.Success;
    }
}
