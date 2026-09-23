using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeagueOfLegends.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Champions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
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
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lanes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlatformUserSnapshot",
                columns: table => new
                {
                    PlatformUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nickname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    AvatarUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformUserSnapshot", x => x.PlatformUserPublicId);
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
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    PresentationIrl = table.Column<string>(type: "text", nullable: true),
                    PresentationIg = table.Column<string>(type: "text", nullable: true),
                    IdUser = table.Column<int>(type: "int", nullable: false),
                    IdKeycloak = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PlatformUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LayoutJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GameName = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: true),
                    TagLine = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    IdRegion = table.Column<int>(type: "int", nullable: true),
                    IdPrimaryLane = table.Column<int>(type: "int", nullable: true),
                    SoloTier = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SoloDivision = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: true),
                    SoloLp = table.Column<int>(type: "int", nullable: true),
                    FlexTier = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    FlexDivision = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: true),
                    FlexLp = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Players_Lanes_IdPrimaryLane",
                        column: x => x.IdPrimaryLane,
                        principalTable: "Lanes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Players_Regions_IdRegion",
                        column: x => x.IdRegion,
                        principalTable: "Regions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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
                    IdKind = table.Column<int>(type: "int", nullable: false),
                    IdLane = table.Column<int>(type: "int", nullable: true)
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
                        name: "FK_PlayerChampions_Lanes_IdLane",
                        column: x => x.IdLane,
                        principalTable: "Lanes",
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
                name: "IX_PlayerChampions_IdLane",
                table: "PlayerChampions",
                column: "IdLane");

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
                name: "IX_Players_GameName_TagLine_IdRegion",
                table: "Players",
                columns: new[] { "GameName", "TagLine", "IdRegion" },
                unique: true,
                filter: "[GameName] IS NOT NULL AND [TagLine] IS NOT NULL AND [IdRegion] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdKeycloak",
                table: "Players",
                column: "IdKeycloak",
                unique: true,
                filter: "[IdKeycloak] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdPrimaryLane",
                table: "Players",
                column: "IdPrimaryLane");

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdRegion",
                table: "Players",
                column: "IdRegion");

            migrationBuilder.CreateIndex(
                name: "IX_Players_PlatformUserPublicId",
                table: "Players",
                column: "PlatformUserPublicId",
                unique: true,
                filter: "[PlatformUserPublicId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Players_PublicId",
                table: "Players",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Regions_Code",
                table: "Regions",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlatformUserSnapshot");

            migrationBuilder.DropTable(
                name: "PlayerChampions");

            migrationBuilder.DropTable(
                name: "PlayerLanes");

            migrationBuilder.DropTable(
                name: "Champions");

            migrationBuilder.DropTable(
                name: "PlayerChampionKinds");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "Lanes");

            migrationBuilder.DropTable(
                name: "Regions");
        }
    }
}
