using Microsoft.EntityFrameworkCore;
using TaskShifter.DataAccess.Entities.Entities;

namespace TaskShifter.DataAccess;

internal class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public virtual DbSet<ProjectEntity> Projects { get; set; }
    public virtual DbSet<UserEntity> Users { get; set; }
    public virtual DbSet<UserToProjectEntity> UsersToProjects { get; set; }
    public virtual DbSet<TaskEntity> Tasks { get; set; }
    public virtual DbSet<ColumnEntity> Columns { get; set; }
    public virtual DbSet<CommentEntity> Comments { get; set; }

    static ApplicationDbContext() => AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserToProjectEntity>()
            .HasKey(up => new { up.UserId, up.ProjectId });

        modelBuilder.Entity<UserEntity>()
            .HasMany(u => u.Projects)
            .WithMany(p => p.Members)
            .UsingEntity<UserToProjectEntity>();
    }
}
