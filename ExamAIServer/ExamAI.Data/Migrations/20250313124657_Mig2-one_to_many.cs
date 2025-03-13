using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExamAI.Data.Migrations
{
    /// <inheritdoc />
    public partial class Mig2one_to_many : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "Student_Id",
                table: "Submissions",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "Exam_Id",
                table: "Submissions",
                newName: "ExamId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Exams",
                newName: "Created_at");

            migrationBuilder.RenameColumn(
                name: "Exam_Id",
                table: "Answers",
                newName: "ExamId");

            migrationBuilder.AddColumn<string>(
                name: "Class",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Users",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "File_Url_FeedBack",
                table: "Submissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_ExamId",
                table: "Submissions",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_StudentId",
                table: "Submissions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_ExamId",
                table: "Answers",
                column: "ExamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Exams_ExamId",
                table: "Answers",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Exams_ExamId",
                table: "Submissions",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Users_StudentId",
                table: "Submissions",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Exams_ExamId",
                table: "Answers");

            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Exams_ExamId",
                table: "Submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Users_StudentId",
                table: "Submissions");

            migrationBuilder.DropIndex(
                name: "IX_Submissions_ExamId",
                table: "Submissions");

            migrationBuilder.DropIndex(
                name: "IX_Submissions_StudentId",
                table: "Submissions");

            migrationBuilder.DropIndex(
                name: "IX_Answers_ExamId",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "Class",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "File_Url_FeedBack",
                table: "Submissions");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Submissions",
                newName: "Student_Id");

            migrationBuilder.RenameColumn(
                name: "ExamId",
                table: "Submissions",
                newName: "Exam_Id");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "Exams",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "ExamId",
                table: "Answers",
                newName: "Exam_Id");

            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Exam_Id = table.Column<int>(type: "int", nullable: false),
                    File_Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    Student_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                });
        }
    }
}
