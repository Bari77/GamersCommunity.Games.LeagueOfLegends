using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeagueOfLegends.Database.Migrations
{
    /// <inheritdoc />
    public partial class TeamGovernance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdTeam",
                table: "LfgAds",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GamePostStatuses",
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
                    table.PrimaryKey("PK_GamePostStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamApplicationStatuses",
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
                    table.PrimaryKey("PK_TeamApplicationStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamRanks",
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
                    table.PrimaryKey("PK_TeamRanks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Entitled = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    Tag = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Sentence = table.Column<string>(type: "nvarchar(280)", maxLength: 280, nullable: true),
                    LayoutJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdCaptain = table.Column<int>(type: "int", nullable: false),
                    IdRegion = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Teams_Players_IdCaptain",
                        column: x => x.IdCaptain,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Teams_Regions_IdRegion",
                        column: x => x.IdRegion,
                        principalTable: "Regions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GamePosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdTeam = table.Column<int>(type: "int", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    IdStatus = table.Column<int>(type: "int", nullable: false),
                    IdModerator = table.Column<int>(type: "int", nullable: true),
                    ModeratedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    ModerationReason = table.Column<string>(type: "nvarchar(280)", maxLength: 280, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GamePosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GamePosts_GamePostStatuses_IdStatus",
                        column: x => x.IdStatus,
                        principalTable: "GamePostStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GamePosts_Players_IdModerator",
                        column: x => x.IdModerator,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GamePosts_Players_IdPlayer",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GamePosts_Teams_IdTeam",
                        column: x => x.IdTeam,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamApplications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdTeam = table.Column<int>(type: "int", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IdStatus = table.Column<int>(type: "int", nullable: false),
                    IdSoughtRank = table.Column<int>(type: "int", nullable: false),
                    IdLane = table.Column<int>(type: "int", nullable: true),
                    IdReviewer = table.Column<int>(type: "int", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamApplications_Lanes_IdLane",
                        column: x => x.IdLane,
                        principalTable: "Lanes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamApplications_Players_IdPlayer",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamApplications_Players_IdReviewer",
                        column: x => x.IdReviewer,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamApplications_TeamApplicationStatuses_IdStatus",
                        column: x => x.IdStatus,
                        principalTable: "TeamApplicationStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamApplications_TeamRanks_IdSoughtRank",
                        column: x => x.IdSoughtRank,
                        principalTable: "TeamRanks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamApplications_Teams_IdTeam",
                        column: x => x.IdTeam,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Position = table.Column<int>(type: "int", nullable: false),
                    IdTeam = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamLinks_Teams_IdTeam",
                        column: x => x.IdTeam,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ModificationDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IdTeam = table.Column<int>(type: "int", nullable: false),
                    IdPlayer = table.Column<int>(type: "int", nullable: false),
                    IdTeamRank = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamMembers_Players_IdPlayer",
                        column: x => x.IdPlayer,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamMembers_TeamRanks_IdTeamRank",
                        column: x => x.IdTeamRank,
                        principalTable: "TeamRanks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamMembers_Teams_IdTeam",
                        column: x => x.IdTeam,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LfgAds_IdTeam",
                table: "LfgAds",
                column: "IdTeam");

            migrationBuilder.CreateIndex(
                name: "IX_GamePosts_IdModerator",
                table: "GamePosts",
                column: "IdModerator");

            migrationBuilder.CreateIndex(
                name: "IX_GamePosts_IdPlayer",
                table: "GamePosts",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_GamePosts_IdStatus",
                table: "GamePosts",
                column: "IdStatus");

            migrationBuilder.CreateIndex(
                name: "IX_GamePosts_IdTeam_IdStatus_CreationDate",
                table: "GamePosts",
                columns: new[] { "IdTeam", "IdStatus", "CreationDate" });

            migrationBuilder.CreateIndex(
                name: "IX_GamePosts_PublicId",
                table: "GamePosts",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GamePostStatuses_Code",
                table: "GamePostStatuses",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_IdLane",
                table: "TeamApplications",
                column: "IdLane");

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_IdPlayer",
                table: "TeamApplications",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_IdReviewer",
                table: "TeamApplications",
                column: "IdReviewer");

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_IdSoughtRank",
                table: "TeamApplications",
                column: "IdSoughtRank");

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_IdStatus",
                table: "TeamApplications",
                column: "IdStatus");

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_IdTeam_IdPlayer_IdStatus",
                table: "TeamApplications",
                columns: new[] { "IdTeam", "IdPlayer", "IdStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplications_PublicId",
                table: "TeamApplications",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamApplicationStatuses_Code",
                table: "TeamApplicationStatuses",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamLinks_IdTeam",
                table: "TeamLinks",
                column: "IdTeam");

            migrationBuilder.CreateIndex(
                name: "IX_TeamLinks_PublicId",
                table: "TeamLinks",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_IdPlayer",
                table: "TeamMembers",
                column: "IdPlayer");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_IdTeam_IdPlayer",
                table: "TeamMembers",
                columns: new[] { "IdTeam", "IdPlayer" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_IdTeamRank",
                table: "TeamMembers",
                column: "IdTeamRank");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_PublicId",
                table: "TeamMembers",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamRanks_Code",
                table: "TeamRanks",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_Entitled_Discriminator",
                table: "Teams",
                columns: new[] { "Entitled", "Discriminator" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_IdCaptain",
                table: "Teams",
                column: "IdCaptain");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_IdRegion",
                table: "Teams",
                column: "IdRegion");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_PublicId",
                table: "Teams",
                column: "PublicId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LfgAds_Teams_IdTeam",
                table: "LfgAds",
                column: "IdTeam",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LfgAds_Teams_IdTeam",
                table: "LfgAds");

            migrationBuilder.DropTable(
                name: "GamePosts");

            migrationBuilder.DropTable(
                name: "TeamApplications");

            migrationBuilder.DropTable(
                name: "TeamLinks");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "GamePostStatuses");

            migrationBuilder.DropTable(
                name: "TeamApplicationStatuses");

            migrationBuilder.DropTable(
                name: "TeamRanks");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_LfgAds_IdTeam",
                table: "LfgAds");

            migrationBuilder.DropColumn(
                name: "IdTeam",
                table: "LfgAds");
        }
    }
}
