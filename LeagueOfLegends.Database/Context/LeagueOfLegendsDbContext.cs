using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Database.Context;

public partial class LeagueOfLegendsDbContext : DbContext
{
    public LeagueOfLegendsDbContext(DbContextOptions<LeagueOfLegendsDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Item> Items { get; set; } = null!;

    public virtual DbSet<PlatformUserSnapshot> PlatformUserSnapshots { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("Items");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Entitled).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<PlatformUserSnapshot>(entity =>
        {
            entity.ToTable("PlatformUserSnapshot");
            entity.HasKey(e => e.PlatformUserPublicId);
            entity.Property(e => e.PlatformUserPublicId).ValueGeneratedNever();
            entity.Property(e => e.Nickname).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Discriminator).HasMaxLength(8).IsRequired();
            entity.Property(e => e.AvatarUrl).HasMaxLength(512).IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
        });
    }
}
