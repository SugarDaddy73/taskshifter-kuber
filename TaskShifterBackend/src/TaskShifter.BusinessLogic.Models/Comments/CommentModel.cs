using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.BusinessLogic.Models.Comments;

public sealed record CommentModel(
    Guid Id,
    Guid AuthorId,
    Guid TaskId,
    string Content,
    DateTime CreationDate,
    DateTime? UpdateDate)
{
    public CommentEntity ToEntity()
    {
        return new CommentEntity
        {
            Id = Id,
            AuthorId = AuthorId,
            TaskId = TaskId,
            Content = Content,
            CreationDate = CreationDate,
            UpdateDate = UpdateDate,
        };
    }

    public static CommentModel From(CommentEntity entity)
    {
        return new CommentModel(
            entity.Id,
            entity.AuthorId,
            entity.TaskId,
            entity.Content,
            entity.CreationDate,
            entity.UpdateDate);
    }
}
