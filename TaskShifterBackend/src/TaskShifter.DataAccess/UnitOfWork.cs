using Microsoft.EntityFrameworkCore.Storage;
using TaskShifter.DataAccess.Repositories;
using TaskShifter.DataLayer.Abstractions;
using TaskShifter.DataLayer.Abstractions.Repositories;

namespace TaskShifter.DataAccess;

internal sealed class UnitOfWork(ApplicationDbContext dbContext) : IUnitOfWork
{
    private IUserRepository? _userRepository;

    private IProjectRepository? _projectRepository;

    private IRoleRepository? _roleRepository;

    private IColumnRepository? _columnRepository;

    private ITaskRepository? _taskRepository;

    private ICommentRepository? _commentRepository;

    public IUserRepository UserRepository
    {
        get
        {
            _userRepository ??= new UserRepository(dbContext);
            return _userRepository;
        }
    }

    public IProjectRepository ProjectRepository
    {
        get
        {
            _projectRepository ??= new ProjectRepository(dbContext);
            return _projectRepository;
        }
    }

    public IRoleRepository RoleRepository
    {
        get
        {
            _roleRepository ??= new RoleRepository(dbContext);
            return _roleRepository;
        }
    }

    public IColumnRepository ColumnRepository
    {
        get
        {
            _columnRepository ??= new ColumnRepository(dbContext);
            return _columnRepository;
        }
    }

    public ITaskRepository TaskRepository
    {
        get
        {
            _taskRepository ??= new TaskRepository(dbContext);
            return _taskRepository;
        }
    }

    public ICommentRepository CommentRepository
    {
        get
        {
            _commentRepository ??= new CommentRepository(dbContext);
            return _commentRepository;
        }
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
    {
        return dbContext.Database.BeginTransactionAsync(ct);
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return dbContext.SaveChangesAsync(ct);
    }
}
