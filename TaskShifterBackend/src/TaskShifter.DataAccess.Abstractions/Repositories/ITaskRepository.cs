using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataLayer.Abstractions.Shared.Action;

namespace TaskShifter.DataLayer.Abstractions.Repositories;

public interface ITaskRepository :
    IFirstByFilterRepository<TaskEntity>,
    IManyByFilterRepository<TaskEntity>,
    IAddRepository<TaskEntity>,
    IUpdateRepository<TaskEntity>,
    IDeleteByIdRepository;
