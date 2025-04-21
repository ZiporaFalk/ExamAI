using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamAI.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigstudentClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Class",
                table: "Users",
                newName: "studentClass");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "studentClass",
                table: "Users",
                newName: "Class");
        }
    }
}
