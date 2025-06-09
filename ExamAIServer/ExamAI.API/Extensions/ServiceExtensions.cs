using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Core;
using ExamAI.Data.Repositories;
using ExamAI.Service.Services;
//using ExamAI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Amazon.S3;
using Amazon;
using Amazon.Runtime;
using ExamAI.Data;  // וודא שיש רק using אחד עם DataContext מתאים

namespace ExamAI.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddScoped<IRepositoryManager, RepositoryManager>();

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ISubmissionRepository, SubmissionRepository>();
            services.AddScoped<IAnswerRepository, AnswerRepository>();
            services.AddScoped<IExamRepository, ExamRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IExamService, ExamService>();
            services.AddScoped<IAnswerService, AnswerService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDashBoardService, DashBoardService>();
            services.AddScoped<IGoogleSheetService, GoogleSheetService>();
            services.AddScoped<IOcrService, OcrService>();

            services.AddAutoMapper(typeof(MappingProfile));
            services.AddSingleton<IAmazonS3>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var credentials = new BasicAWSCredentials(
                configuration["AWS:AccessKey"],
                configuration["AWS:SecretKey"]
                );
                var clientConfig = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
                };
                return new AmazonS3Client(credentials, clientConfig);
            });

            //var configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>(); //my
            var connectionString = configuration.GetConnectionString("ExamAIDB");
            services.AddDbContext<DataContext>(options =>
            {
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            });

            //services.AddDbContext<DataContext>(options =>
            //options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        }

    }
}
