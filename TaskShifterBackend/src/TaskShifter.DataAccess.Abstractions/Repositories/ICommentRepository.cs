using TaskShifter.DataAccess.Entities.Entities;
using TaskShifter.DataLayer.Abstractions.Shared.Action;

namespace TaskShifter.DataLayer.Abstractions.Repositories;

public interface ICommentRepository :
    IFirstByFilterRepository<CommentEntity>,
    IManyByFilterRepository<CommentEntity>,
    IAddRepository<CommentEntity>,
    IUpdateRepository<CommentEntity>,
    IDeleteByIdRepository;
