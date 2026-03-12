using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskShifter.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddLastMovedDateToTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastMovedDate",
                table: "Tasks",
                type: "timestamp without time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastMovedDate",
                table: "Tasks");
        }
    }
}
