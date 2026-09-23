using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Database.Context;

public partial class LeagueOfLegendsDbContext : DbContext
{
    public LeagueOfLegendsDbContext(DbContextOptions<LeagueOfLegendsDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Player> Players { get; set; } = null!;

    public virtual DbSet<PlatformUserSnapshot> PlatformUserSnapshots { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

        modelBuilder.Entity<Player>(entity =>
        {
            entity.ToTable("Players");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PresentationIg).HasColumnType("text");
            entity.Property(e => e.PresentationIrl).HasColumnType("text");
            entity.Property(e => e.LayoutJson).HasColumnType("nvarchar(max)");
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => e.IdKeycloak)
                .IsUnique()
                .HasFilter("[IdKeycloak] IS NOT NULL");
            entity.HasIndex(e => e.PlatformUserPublicId)
                .IsUnique()
                .HasFilter("[PlatformUserPublicId] IS NOT NULL");
        });
    }
}
