using FullStack.Api.Data;
using FullStack.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Host=localhost;Database=fullstack_ec2;Username=postgres;Password=postgres;Port=5432"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "FullStack EC2 API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", message = "API is working", timestamp = DateTime.UtcNow }));

app.MapGet("/api/todos", async (AppDbContext db) =>
    await db.Todos.OrderBy(item => item.Id).ToListAsync());

app.MapGet("/api/todos/{id:int}", async (int id, AppDbContext db) =>
    await db.Todos.FindAsync(id) is TodoItem item
        ? Results.Ok(item)
        : Results.NotFound());

app.MapPost("/api/todos", async (TodoItem item, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(item.Title))
    {
        return Results.BadRequest(new { message = "Title is required." });
    }

    item.CreatedAt = DateTime.UtcNow;
    item.UpdatedAt = DateTime.UtcNow;

    db.Todos.Add(item);
    await db.SaveChangesAsync();

    return Results.Created($"/api/todos/{item.Id}", item);
});

app.MapPut("/api/todos/{id:int}", async (int id, TodoItem updatedItem, AppDbContext db) =>
{
    var existingItem = await db.Todos.FindAsync(id);
    if (existingItem is null)
    {
        return Results.NotFound();
    }

    existingItem.Title = updatedItem.Title;
    existingItem.Description = updatedItem.Description;
    existingItem.IsComplete = updatedItem.IsComplete;
    existingItem.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.Ok(existingItem);
});

app.MapDelete("/api/todos/{id:int}", async (int id, AppDbContext db) =>
{
    var item = await db.Todos.FindAsync(id);
    if (item is null)
    {
        return Results.NotFound();
    }

    db.Todos.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
