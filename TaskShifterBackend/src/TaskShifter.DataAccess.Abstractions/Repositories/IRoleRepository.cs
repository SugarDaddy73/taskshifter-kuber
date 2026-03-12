using TaskShifter.DataAccess.Entities.Entities.Enums;
using TaskShifter.Shared.Results;

namespace TaskShifter.DataLayer.Abstractions.Repositories;

public interface IRoleRepository
{
    Task<Result> AssignRoleAsync(
        Guid projectId,
        Guid userId,
        Role role,
        CancellationToken ct = default);

    Task<Result> RemoveAssociationAsync(
        Guid projectId,
        Guid userId,
        CancellationToken ct = default);

    Task<Result<Role>> GetUserRoleAsync(
        Guid projectId,
        Guid userId,
        CancellationToken ct = default);
}
