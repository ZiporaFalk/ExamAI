using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamAI.Data.Migrations
{
    /// <inheritdoc />
    public partial class correctAnswer3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "correctAnswer",
                table: "Answers",
                newName: "CorrectAnswer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CorrectAnswer",
                table: "Answers",
                newName: "correctAnswer");
        }
    }
}
