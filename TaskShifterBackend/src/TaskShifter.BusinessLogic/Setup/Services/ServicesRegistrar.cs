using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskShifter.BusinessLogic.Services.Columns.Abstractions;
using TaskShifter.BusinessLogic.Services.Comments;
using TaskShifter.BusinessLogic.Services.Comments.Abstractions;
using TaskShifter.BusinessLogic.Services.Projects;
using TaskShifter.BusinessLogic.Services.Projects.Abstractions;
using TaskShifter.BusinessLogic.Services.Tasks;
using TaskShifter.BusinessLogic.Services.Tasks.Abstractions;
using TaskShifter.BusinessLogic.Services.Users;
using TaskShifter.BusinessLogic.Services.Users.Abstractions;

namespace TaskShifter.BusinessLogic.Setup.Services;

public sealed class ServicesRegistrar : BusinessLogicRegistrar
{
    public override IServiceCollection Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IUserService, UserService>();
        services.AddTransient<IColumnService, ColumnService>();
        services.AddTransient<IProjectService, ProjectService>();
        services.AddTransient<ITaskService, TaskService>();
        services.AddTransient<ICommentService, CommentService>();

        return services;
    }
}
