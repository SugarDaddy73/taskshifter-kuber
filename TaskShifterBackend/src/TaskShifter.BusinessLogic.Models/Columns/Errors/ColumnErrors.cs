using TaskShifter.Shared.Results;

namespace TaskShifter.BusinessLogic.Models.Columns.Errors;

public static class ColumnErrors
{
    public static class Codes
    {
        public const string ColumnNotFound = "COLUMN_NOT_FOUND";
    }

    public static Error NotFound => new(
        Codes.ColumnNotFound,
        "Column has not been found");
}
