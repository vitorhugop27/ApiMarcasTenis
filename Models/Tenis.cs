namespace ApiMarcasTenis.Models;

public class Tenis
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public double Preco { get; set; }

    public Tenis() { }

    public Tenis(int id, string nome, string marca, double preco)
    {
        Id = id;
        Nome = nome;
        Marca = marca;
        Preco = preco;
    }
}

public record TenisInputDto(string Nome, string Marca, double Preco);
public record TenisDto(int Id, string Nome, string Marca, double Preco);
