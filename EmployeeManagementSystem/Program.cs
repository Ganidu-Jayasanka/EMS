using EmployeeManagementSystem.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocal3000", policy =>
    {
        policy.WithOrigins("http://localhost:3000")

        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
// register repos with connection string pulled from config
var conn = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddScoped<IDepartmentRepository>(_ => new DepartmentRepository(conn));
builder.Services.AddScoped<IEmployeeRepository>(_ => new EmployeeRepository(conn));


var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("AllowLocal3000");
app.UseAuthorization();
app.MapControllers();
app.Run();