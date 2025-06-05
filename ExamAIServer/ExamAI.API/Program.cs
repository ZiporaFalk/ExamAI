
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon;
using Amazon.S3;
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

using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddHttpClient();

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.ConfigureSwagger();
builder.Services.ConfigureServices();
//builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
//õõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõ
// äâãøú AWS S3-úäéìä
//builder.Services.AddDefaultAWSOptions(new AWSOptions
//{
//    BasicCredentials = new AWSCredentials(
//        configuration["AWS:AccessKey"],
//        configuration["AWS:SecretKey"]
//    ),
//    Region = RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
//});
//builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddDefaultAWSOptions(new AWSOptions
{
    Credentials = new BasicAWSCredentials(
        builder.Configuration["AWS:AccessKey"],
        builder.Configuration["AWS:SecretKey"]
    ),
    Region = RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
});
builder.Services.AddAWSService<IAmazonS3>();

//õõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõõ
builder.Services.ConfigureJwt(builder.Configuration);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

//JWT
// äåñôú äøùàåú îáåññåú-úô÷éãéí
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
    options.AddPolicy("StudentOrAdmin", policy => policy.RequireRole("Student", "Admin"));
});

var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();
app.UseAuthentication();//JWT

app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "AuthServer API is running!");
app.Run();


