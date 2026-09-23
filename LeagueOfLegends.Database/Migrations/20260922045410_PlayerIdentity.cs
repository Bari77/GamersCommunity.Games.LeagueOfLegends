using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeagueOfLegends.Database.Migrations
{
    /// <inheritdoc />
    public partial class PlayerIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    LayoutJson = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Players_IdKeycloak",
                table: "Players",
                column: "IdKeycloak",
                unique: true,
                filter: "[IdKeycloak] IS NOT NULL");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Players");
        }
    }
}
