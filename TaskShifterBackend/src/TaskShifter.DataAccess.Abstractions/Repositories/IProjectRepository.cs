using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataLayer.Abstractions.Shared.Action;

namespace TaskShifter.DataLayer.Abstractions.Repositories;

public interface IProjectRepository :
    IFirstByFilterRepository<ProjectEntity>,
    IManyByFilterRepository<ProjectEntity>,
    IAddRepository<ProjectEntity>,
    IUpdateRepository<ProjectEntity>,
    IDeleteByIdRepository;
