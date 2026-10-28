using Microsoft.EntityFrameworkCore;
using ApiMarcasTenis.Models;

namespace ApiMarcasTenis.Data;

public class TenisDbContext : DbContext
{
    public TenisDbContext(DbContextOptions<TenisDbContext> options) : base(options)
    {
    }

    public DbSet<Tenis> Tenis => Set<Tenis>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Tenis>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired();
            entity.Property(e => e.Marca).IsRequired();
            entity.Property(e => e.Preco).IsRequired();
        });
    }
}
