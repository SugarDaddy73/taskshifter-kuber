using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities.Abstractions;

namespace TaskShifter.DataAccess.Shared.Extensions;

internal static class QueryableExtensions
{
    public static IQueryable<TEntity> ApplyIncludes<TEntity>(this IQueryable<TEntity> query, string[]? includeOptions)
        where TEntity : class, IEntity
    {
        if (includeOptions == null)
        {
            return query;
        }

        foreach (string option in includeOptions)
        {
            query = query.Include(option);
        }

        return query;
    }
}
