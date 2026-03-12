using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataLayer.Abstractions.Shared.Action;

namespace TaskShifter.DataLayer.Abstractions.Repositories;

public interface IColumnRepository :
    IFirstByFilterRepository<ColumnEntity>,
    IManyByFilterRepository<ColumnEntity>,
    IAddRepository<ColumnEntity>,
    IUpdateRepository<ColumnEntity>,
    IDeleteByIdRepository;
