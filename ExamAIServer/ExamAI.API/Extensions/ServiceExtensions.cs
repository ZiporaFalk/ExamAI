using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Core;
using ExamAI.Data.Repositories;
using ExamAI.Service.Services;
using ExamAI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using Amazon.S3;
using Amazon;
using Amazon.Runtime;

namespace ExamAI.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services)
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



            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<DataContext>();
            services.AddSingleton<IAmazonS3>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var credentials = new BasicAWSCredentials(
                //configuration["AWS:AccessKey"],
                //configuration["AWS:SecretKey"]
                Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID"),
                Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
                );
                var clientConfig = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
                };
                return new AmazonS3Client(credentials, clientConfig);
            });
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<DataContext>();
            //services.AddDbContext<DataContext>(options =>
            //options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        }

    }
}
