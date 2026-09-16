var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var tenis = new List<Tenis>
{
    new Tenis(1, "Nike Air Max", "Nike", 599.90),
    new Tenis(2, "Ultraboost", "Adidas", 799.90)
};

app.MapGet("/", () => "API Marcas de Tenis funcionando!");

app.MapGet("/api/tenis", () =>
{
    var lista = tenis.Select(t => new TenisDto(t.Id, t.Nome, t.Marca, t.Preco)).ToList();
    return Results.Ok(lista);
});

app.MapGet("/api/tenis/{id}", (int id) =>
{
    var item = tenis.FirstOrDefault(t => t.Id == id);

    if (item == null)
        return Results.NotFound();

    return Results.Ok(new TenisDto(item.Id, item.Nome, item.Marca, item.Preco));
});

app.MapPost("/api/tenis", (TenisInputDto entrada) =>
{
    var novoId = tenis.Count == 0 ? 1 : tenis.Max(t => t.Id) + 1;

    var novoTenis = new Tenis(novoId, entrada.Nome, entrada.Marca, entrada.Preco);

    tenis.Add(novoTenis);

    return Results.Created($"/api/tenis/{novoId}", new TenisDto(novoTenis.Id, novoTenis.Nome, novoTenis.Marca, novoTenis.Preco));
});

app.MapPut("/api/tenis/{id}", (int id, TenisInputDto entrada) =>
{
    var item = tenis.FirstOrDefault(t => t.Id == id);

    if (item == null)
        return Results.NotFound();

    var novoTenis = new Tenis(id, entrada.Nome, entrada.Marca, entrada.Preco);

    tenis[tenis.IndexOf(item)] = novoTenis;

    return Results.Ok(new TenisDto(novoTenis.Id, novoTenis.Nome, novoTenis.Marca, novoTenis.Preco));
});

app.MapDelete("/api/tenis/{id}", (int id) =>
{
    var item = tenis.FirstOrDefault(t => t.Id == id);

    if (item == null)
        return Results.NotFound();

    tenis.Remove(item);

    return Results.NoContent();
});

app.Run();

record Tenis(int Id, string Nome, string Marca, double Preco);
record TenisDto(int Id, string Nome, string Marca, double Preco);
record TenisInputDto(string Nome, string Marca, double Preco);