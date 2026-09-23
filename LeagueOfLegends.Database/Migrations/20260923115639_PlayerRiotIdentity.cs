using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LeagueOfLegends.Database.Migrations
{
    /// <inheritdoc />
    public partial class PlayerRiotIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FlexDivision",
                table: "Players",
                type: "nvarchar(4)",
                maxLength: 4,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FlexLp",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FlexTier",
                table: "Players",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GameName",
                table: "Players",
                type: "nvarchar(16)",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdPrimaryLane",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdRegion",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoloDivision",
                table: "Players",
                type: "nvarchar(4)",
                maxLength: 4,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SoloLp",
                table: "Players",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoloTier",
                table: "Players",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TagLine",
                table: "Players",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Champions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Entitled = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Champions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lanes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Entitled = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lanes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlayerChampionKinds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Entitled = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerChampionKinds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Entitled = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlayerLanes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    IdLane = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerLanes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerLanes_Lanes_IdLane",
                        column: x => x.IdLane,
                        principalTable: "Lanes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlayerLanes_Players_IdPlayer",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlayerChampions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    IdChampion = table.Column<int>(type: "int", nullable: false),
                    IdKind = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerChampions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerChampions_Champions_IdChampion",
                        column: x => x.IdChampion,
                        principalTable: "Champions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlayerChampions_PlayerChampionKinds_IdKind",
                        column: x => x.IdKind,
                        principalTable: "PlayerChampionKinds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlayerChampions_Players_IdPlayer",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Champions",
                columns: new[] { "Id", "Code", "CreationDate", "Entitled", "ModificationDate" },
                values: new object[,]
                {
                    { 1, "aatrox", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Aatrox", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "ahri", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Ahri", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, "akali", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Akali", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, "alistar", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Alistar", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, "amumu", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Amumu", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, "anivia", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Anivia", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, "annie", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Annie", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, "aphelios", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Aphelios", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, "ashe", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Ashe", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, "azir", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Azir", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, "bard", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Bard", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, "blitzcrank", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Blitzcrank", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, "brand", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Brand", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 14, "braum", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Braum", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 15, "caitlyn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Caitlyn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 16, "camille", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Camille", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 17, "cassiopeia", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Cassiopeia", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 18, "darius", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Darius", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 19, "diana", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Diana", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 20, "draven", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Draven", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 21, "ekko", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Ekko", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 22, "evelynn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Evelynn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 23, "ezreal", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Ezreal", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 24, "fiora", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Fiora", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 25, "fizz", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Fizz", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 26, "gnar", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Gnar", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 27, "graves", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Graves", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 28, "hecarim", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Hecarim", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 29, "illaoi", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Illaoi", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 30, "irelia", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Irelia", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 31, "janna", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Janna", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 32, "jarvaniv", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Jarvan IV", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 33, "jax", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Jax", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 34, "jhin", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Jhin", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 35, "jinx", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Jinx", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 36, "kaisa", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Kai'Sa", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 37, "karma", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Karma", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 38, "kassadin", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Kassadin", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 39, "katarina", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Katarina", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 40, "kayle", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Kayle", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 41, "kayn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Kayn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 42, "khazix", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Kha'Zix", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 43, "kindred", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Kindred", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 44, "leblanc", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "LeBlanc", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 45, "leesin", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Lee Sin", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 46, "leona", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Leona", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 47, "lulu", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Lulu", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 48, "lux", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Lux", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 49, "malphite", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Malphite", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 50, "missfortune", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Miss Fortune", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 51, "mordekaiser", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Mordekaiser", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 52, "morgana", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Morgana", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 53, "nami", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Nami", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 54, "nasus", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Nasus", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 55, "nautilus", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Nautilus", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 56, "nidalee", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Nidalee", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 57, "orianna", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Orianna", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 58, "ornn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Ornn", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 59, "pyke", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Pyke", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 60, "rakan", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Rakan", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 61, "renekton", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Renekton", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 62, "riven", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Riven", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 63, "senna", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Senna", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 64, "seraphine", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Seraphine", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 65, "sett", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Sett", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 66, "sion", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Sion", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 67, "sivir", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Sivir", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 68, "sona", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Sona", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 69, "soraka", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Soraka", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 70, "syndra", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Syndra", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 71, "thresh", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Thresh", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 72, "tristana", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Tristana", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 73, "twitch", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Twitch", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 74, "varus", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Varus", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 75, "vayne", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Vayne", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 76, "veigar", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Veigar", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 77, "viego", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Viego", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 78, "viktor", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Viktor", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 79, "warwick", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Warwick", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 80, "xayah", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Xayah", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 81, "xinzhao", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Xin Zhao", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 82, "yasuo", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Yasuo", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 83, "yone", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Yone", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 84, "yuumi", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Yuumi", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 85, "zed", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Zed", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 86, "zeri", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Zeri", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 87, "zoe", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Zoe", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 88, "zyra", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Zyra", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Lanes",
                columns: new[] { "Id", "Code", "CreationDate", "Entitled", "ModificationDate", "SortOrder" },
                values: new object[,]
                {
                    { 1, "top", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Top", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 2, "jungle", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Jungle", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 3, "mid", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Mid", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 3 },
                    { 4, "bottom", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Bottom", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 4 },
                    { 5, "support", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Support", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 5 }
                });

            migrationBuilder.InsertData(
                table: "PlayerChampionKinds",
                columns: new[] { "Id", "Code", "CreationDate", "Entitled", "ModificationDate", "SortOrder" },
                values: new object[,]
                {
                    { 1, "main", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Main", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 2, "pool", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Pool", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 3, "learning", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Learning", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 3 }
                });

            migrationBuilder.InsertData(
                table: "Regions",
                columns: new[] { "Id", "Code", "CreationDate", "Entitled", "ModificationDate", "SortOrder" },
                values: new object[,]
                {
                    { 1, "euw", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "EU West", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 2, "eune", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "EU Nordic & East", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 3, "na", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "North America", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 3 },
                    { 4, "kr", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Korea", new DateTime(2026, 9, 23, 0, 0, 0, 0, DateTimeKind.Utc), 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Players_GameName_TagLine_IdRegion",
                table: "Players",
                columns: new[] { "GameName", "TagLine", "IdRegion" },
                unique: true,
                filter: "[GameName] IS NOT NULL AND [TagLine] IS NOT NULL AND [IdRegion] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdPrimaryLane",
                table: "Players",
                column: "IdPrimaryLane");

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdRegion",
                table: "Players",
                column: "IdRegion");

            migrationBuilder.CreateIndex(
                name: "IX_Champions_Code",
                table: "Champions",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lanes_Code",
                table: "Lanes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerChampionKinds_Code",
                table: "PlayerChampionKinds",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerChampions_IdChampion",
                table: "PlayerChampions",
                column: "IdChampion");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerChampions_IdKind",
                table: "PlayerChampions",
                column: "IdKind");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerChampions_IdPlayer_IdChampion",
                table: "PlayerChampions",
                columns: new[] { "IdPlayer", "IdChampion" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerLanes_IdLane",
                table: "PlayerLanes",
                column: "IdLane");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerLanes_IdPlayer_IdLane",
                table: "PlayerLanes",
                columns: new[] { "IdPlayer", "IdLane" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Regions_Code",
                table: "Regions",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Lanes_IdPrimaryLane",
                table: "Players",
                column: "IdPrimaryLane",
                principalTable: "Lanes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Regions_IdRegion",
                table: "Players",
                column: "IdRegion",
                principalTable: "Regions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Players_Lanes_IdPrimaryLane",
                table: "Players");

            migrationBuilder.DropForeignKey(
                name: "FK_Players_Regions_IdRegion",
                table: "Players");

            migrationBuilder.DropTable(
                name: "PlayerChampions");

            migrationBuilder.DropTable(
                name: "PlayerLanes");

            migrationBuilder.DropTable(
                name: "Regions");

            migrationBuilder.DropTable(
                name: "Champions");

            migrationBuilder.DropTable(
                name: "PlayerChampionKinds");

            migrationBuilder.DropTable(
                name: "Lanes");

            migrationBuilder.DropIndex(
                name: "IX_Players_GameName_TagLine_IdRegion",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_IdPrimaryLane",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_IdRegion",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "FlexDivision",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "FlexLp",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "FlexTier",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "GameName",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "IdPrimaryLane",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "IdRegion",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "SoloDivision",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "SoloLp",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "SoloTier",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "TagLine",
                table: "Players");
        }
    }
}
