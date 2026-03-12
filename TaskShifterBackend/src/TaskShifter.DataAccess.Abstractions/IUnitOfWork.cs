using Microsoft.EntityFrameworkCore.Storage;
using TaskShifter.DataLayer.Abstractions.Repositories;

namespace TaskShifter.DataLayer.Abstractions;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }

    IProjectRepository ProjectRepository { get; }

    IRoleRepository RoleRepository { get; }

    IColumnRepository ColumnRepository { get; }

    ITaskRepository TaskRepository { get; }

    ICommentRepository CommentRepository { get; }

    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}
