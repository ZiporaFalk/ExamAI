using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamAI.Data.Migrations
{
    /// <inheritdoc />
    public partial class publicstringFile_Urlgetset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "File_Url",
                table: "Exams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "File_Url",
                table: "Exams");
        }
    }
}
