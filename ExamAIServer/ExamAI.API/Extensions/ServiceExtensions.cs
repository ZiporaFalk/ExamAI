using ExamAI.Core.Repositories;
using ExamAI.Core.Services;
using ExamAI.Core;
using ExamAI.Data.Repositories;
using ExamAI.Service.Services;
using ExamAI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
<<<<<<< HEAD

=======
using Amazon.S3;
using Amazon;
using Amazon.Runtime;
>>>>>>> 450371c (ExamUploadFilesAWS)
namespace ExamAI.API.Extensions
{
    public static class ServiceExtensions
    {
<<<<<<< HEAD
=======
        //public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
>>>>>>> 450371c (ExamUploadFilesAWS)
        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<IRepositoryManager, RepositoryManager>();

            services.AddScoped<IUserRepository, UserRepository>();
<<<<<<< HEAD
            //services.AddScoped<IStudentRepository, StudentRepository>();
=======
>>>>>>> 450371c (ExamUploadFilesAWS)
            services.AddScoped<ISubmissionRepository, SubmissionRepository>();
            services.AddScoped<IAnswerRepository, AnswerRepository>();
            services.AddScoped<IExamRepository, ExamRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();

            services.AddScoped<IUserService, UserService>();
<<<<<<< HEAD
            //services.AddScoped<IStudentService, StudentService>();
=======
>>>>>>> 450371c (ExamUploadFilesAWS)
            services.AddScoped<IExamService, ExamService>();
            services.AddScoped<IAnswerService, AnswerService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IAuthService, AuthService>();
<<<<<<< HEAD



            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<DataContext>();
            //        services.AddDbContext<DataContext>(options =>
=======
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
>>>>>>> 450371c (ExamUploadFilesAWS)
            //options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        }

    }
}
