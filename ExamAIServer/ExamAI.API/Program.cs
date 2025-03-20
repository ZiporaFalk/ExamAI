<<<<<<< HEAD
=======
using Amazon.S3;
>>>>>>> 450371c (ExamUploadFilesAWS)
using AutoMapper;
using ExamAI.API.Controllers;
using ExamAI.API.Extensions;
using ExamAI.Core;
using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Data;
using ExamAI.Data.Repositories;
using ExamAI.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
<<<<<<< HEAD
=======
using System.Text.Json.Serialization;
>>>>>>> 450371c (ExamUploadFilesAWS)

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.ConfigureSwagger();

builder.Services.ConfigureServices();
<<<<<<< HEAD
=======
//builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
>>>>>>> 450371c (ExamUploadFilesAWS)

builder.Services.ConfigureJwt(builder.Configuration);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

//JWT
// הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
<<<<<<< HEAD

=======
>>>>>>> 450371c (ExamUploadFilesAWS)
}
app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();
app.UseAuthentication();//JWT

app.UseAuthorization();

app.MapControllers();

app.Run();

<<<<<<< HEAD
=======

>>>>>>> 450371c (ExamUploadFilesAWS)
