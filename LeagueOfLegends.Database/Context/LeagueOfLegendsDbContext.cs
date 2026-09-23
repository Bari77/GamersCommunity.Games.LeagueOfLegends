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

    public virtual DbSet<Lane> Lanes { get; set; } = null!;

    public virtual DbSet<Region> Regions { get; set; } = null!;

    public virtual DbSet<Champion> Champions { get; set; } = null!;

    public virtual DbSet<PlayerChampionKind> PlayerChampionKinds { get; set; } = null!;

    public virtual DbSet<PlayerLane> PlayerLanes { get; set; } = null!;

    public virtual DbSet<PlayerChampion> PlayerChampions { get; set; } = null!;

    public virtual DbSet<PlayerPicture> PlayerPictures { get; set; } = null!;

    public virtual DbSet<PlayerVideo> PlayerVideos { get; set; } = null!;

    public virtual DbSet<PlayerStream> PlayerStreams { get; set; } = null!;

    public virtual DbSet<LfgAd> LfgAds { get; set; } = null!;

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

        ConfigureCatalog(modelBuilder.Entity<Lane>(), "Lanes");
        ConfigureCatalog(modelBuilder.Entity<Region>(), "Regions");
        ConfigureCatalog(modelBuilder.Entity<Champion>(), "Champions", hasSortOrder: false);
        ConfigureCatalog(modelBuilder.Entity<PlayerChampionKind>(), "PlayerChampionKinds");

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
            entity.Property(e => e.GameName).HasMaxLength(16);
            entity.Property(e => e.TagLine).HasMaxLength(5);
            entity.Property(e => e.SoloTier).HasMaxLength(20);
            entity.Property(e => e.SoloDivision).HasMaxLength(4);
            entity.Property(e => e.FlexTier).HasMaxLength(20);
            entity.Property(e => e.FlexDivision).HasMaxLength(4);
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => e.IdKeycloak)
                .IsUnique()
                .HasFilter("[IdKeycloak] IS NOT NULL");
            entity.HasIndex(e => e.PlatformUserPublicId)
                .IsUnique()
                .HasFilter("[PlatformUserPublicId] IS NOT NULL");
            entity.HasIndex(e => new { e.GameName, e.TagLine, e.IdRegion })
                .IsUnique()
                .HasFilter("[GameName] IS NOT NULL AND [TagLine] IS NOT NULL AND [IdRegion] IS NOT NULL");
            entity.HasOne(e => e.IdRegionNavigation)
                .WithMany(r => r.Players)
                .HasForeignKey(e => e.IdRegion)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.IdPrimaryLaneNavigation)
                .WithMany(l => l.PrimaryPlayers)
                .HasForeignKey(e => e.IdPrimaryLane)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PlayerLane>(entity =>
        {
            entity.ToTable("PlayerLanes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.HasIndex(e => new { e.IdPlayer, e.IdLane }).IsUnique();
            entity.HasOne(e => e.IdPlayerNavigation)
                .WithMany(p => p.PlayerLanes)
                .HasForeignKey(e => e.IdPlayer)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.IdLaneNavigation)
                .WithMany(l => l.PlayerLanes)
                .HasForeignKey(e => e.IdLane)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PlayerChampion>(entity =>
        {
            entity.ToTable("PlayerChampions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.HasIndex(e => new { e.IdPlayer, e.IdChampion }).IsUnique();
            entity.HasOne(e => e.IdPlayerNavigation)
                .WithMany(p => p.PlayerChampions)
                .HasForeignKey(e => e.IdPlayer)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.IdChampionNavigation)
                .WithMany(c => c.PlayerChampions)
                .HasForeignKey(e => e.IdChampion)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.IdKindNavigation)
                .WithMany(k => k.PlayerChampions)
                .HasForeignKey(e => e.IdKind)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.IdLaneNavigation)
                .WithMany(l => l.PlayerChampions)
                .HasForeignKey(e => e.IdLane)
                .OnDelete(DeleteBehavior.Restrict);
        });

        ConfigurePlayerMedia(modelBuilder);
        ConfigureLfgAds(modelBuilder);
    }

    private static void ConfigurePlayerMedia(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlayerPicture>(entity =>
        {
            entity.ToTable("PlayerPictures");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(150).IsRequired();
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => e.IdPlayer);
            entity.HasOne(e => e.IdPlayerNavigation)
                .WithMany(p => p.PlayerPictures)
                .HasForeignKey(e => e.IdPlayer)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PlayerVideo>(entity =>
        {
            entity.ToTable("PlayerVideos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(150).IsRequired();
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => e.IdPlayer);
            entity.HasOne(e => e.IdPlayerNavigation)
                .WithMany(p => p.PlayerVideos)
                .HasForeignKey(e => e.IdPlayer)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PlayerStream>(entity =>
        {
            entity.ToTable("PlayerStreams");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(150);
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => e.IdPlayer);
            entity.HasOne(e => e.IdPlayerNavigation)
                .WithMany(p => p.PlayerStreams)
                .HasForeignKey(e => e.IdPlayer)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureLfgAds(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LfgAd>(entity =>
        {
            entity.ToTable("LfgAds");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModificationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Kind).HasMaxLength(32).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Body).HasMaxLength(2000).IsRequired();
            entity.Property(e => e.ExpiresAt).HasColumnType("datetime");
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => new { e.IsActive, e.ExpiresAt, e.Kind, e.CreationDate });
            entity.HasOne(e => e.IdPlayerNavigation)
                .WithMany(p => p.LfgAds)
                .HasForeignKey(e => e.IdPlayer)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.IdRegionNavigation)
                .WithMany(r => r.LfgAds)
                .HasForeignKey(e => e.IdRegion)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.IdLaneNavigation)
                .WithMany(l => l.LfgAds)
                .HasForeignKey(e => e.IdLane)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureCatalog<TEntity>(
        Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<TEntity> entity,
        string table,
        bool hasSortOrder = true)
        where TEntity : class
    {
        entity.ToTable(table);
        entity.HasKey("Id");
        entity.Property("Code").HasMaxLength(32).IsRequired();
        entity.Property("CreationDate").HasColumnType("datetime");
        entity.Property("ModificationDate").HasColumnType("datetime");
        entity.HasIndex("Code").IsUnique();
        if (hasSortOrder)
            entity.Property("SortOrder").IsRequired();
    }
}
