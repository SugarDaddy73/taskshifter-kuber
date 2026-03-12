using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataLayer.Abstractions.Shared.Action;

namespace TaskShifter.DataLayer.Abstractions.Repositories;

public interface IUserRepository :
    IFirstByFilterRepository<UserEntity>,
    IAddRepository<UserEntity>,
    IUpdateRepository<UserEntity>;
