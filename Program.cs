using Microsoft.EntityFrameworkCore;
using ApiMarcasTenis.Data;
using ApiMarcasTenis.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Entity Framework Core com SQLite
builder.Services.AddDbContext<TenisDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=tenis.db"));

var app = builder.Build();

// Aplica migrações pendentes e insere dados iniciais caso o banco esteja vazio
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TenisDbContext>();
    db.Database.Migrate();
    if (!db.Tenis.Any())
    {
        db.Tenis.AddRange(
            new Tenis { Nome = "Nike Air Max", Marca = "Nike", Preco = 599.90 },
            new Tenis { Nome = "Ultraboost", Marca = "Adidas", Preco = 799.90 }
        );
        db.SaveChanges();
    }
}

// Configuração para servir arquivos estáticos de wwwroot (index.html, style.css, app.js)
app.UseDefaultFiles();
app.UseStaticFiles();

// Rotas da API RESTful com acesso ao banco de dados SQLite
app.MapGet("/api/tenis", async (TenisDbContext db) =>
{
    var lista = await db.Tenis
        .Select(t => new TenisDto(t.Id, t.Nome, t.Marca, t.Preco))
        .ToListAsync();

    return Results.Ok(lista);
});

app.MapGet("/api/tenis/{id:int}", async (int id, TenisDbContext db) =>
{
    var item = await db.Tenis.FindAsync(id);

    if (item == null)
        return Results.NotFound();

    return Results.Ok(new TenisDto(item.Id, item.Nome, item.Marca, item.Preco));
});

app.MapPost("/api/tenis", async (TenisInputDto entrada, TenisDbContext db) =>
{
    var novoTenis = new Tenis
    {
        Nome = entrada.Nome,
        Marca = entrada.Marca,
        Preco = entrada.Preco
    };

    db.Tenis.Add(novoTenis);
    await db.SaveChangesAsync();

    return Results.Created($"/api/tenis/{novoTenis.Id}", new TenisDto(novoTenis.Id, novoTenis.Nome, novoTenis.Marca, novoTenis.Preco));
});

app.MapPut("/api/tenis/{id:int}", async (int id, TenisInputDto entrada, TenisDbContext db) =>
{
    var item = await db.Tenis.FindAsync(id);

    if (item == null)
        return Results.NotFound();

    item.Nome = entrada.Nome;
    item.Marca = entrada.Marca;
    item.Preco = entrada.Preco;

    await db.SaveChangesAsync();

    return Results.Ok(new TenisDto(item.Id, item.Nome, item.Marca, item.Preco));
});

app.MapDelete("/api/tenis/{id:int}", async (int id, TenisDbContext db) =>
{
    var item = await db.Tenis.FindAsync(id);

    if (item == null)
        return Results.NotFound();

    db.Tenis.Remove(item);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
