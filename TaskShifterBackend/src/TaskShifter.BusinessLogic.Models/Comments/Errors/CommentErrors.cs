using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Models.Comments.Errors;

public static class CommentErrors
{
    public static class Codes
    {
        public const string CommentNotFound = "COMMENT_NOT_FOUND";
        public const string YouAreNotAuthor = "YOU_ARE_NOT_AUTHOR_OF_COMMENT";
    }

    public static Error NotFound => new(
        Codes.CommentNotFound,
        "Comment has not been found");

    public static Error YouAreNotAuthor => new(
        Codes.YouAreNotAuthor,
        "You are not the author of this comment to edit or delete it");
}
