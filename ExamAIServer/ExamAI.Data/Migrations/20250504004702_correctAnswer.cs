using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamAI.Data.Migrations
{
    /// <inheritdoc />
    public partial class correctAnswer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CorrectValue",
                table: "Answers",
                newName: "correctAnswer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "correctAnswer",
                table: "Answers",
                newName: "CorrectValue");
        }
    }
}
