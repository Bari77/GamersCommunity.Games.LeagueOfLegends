using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeagueOfLegends.Database.Migrations
{
    /// <inheritdoc />
    public partial class TeamMemberRosterSeat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdLane",
                table: "TeamMembers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RosterKind",
                table: "TeamMembers",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_IdLane",
                table: "TeamMembers",
                column: "IdLane");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_Lanes_IdLane",
                table: "TeamMembers",
                column: "IdLane",
                principalTable: "Lanes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_Lanes_IdLane",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_IdLane",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "IdLane",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "RosterKind",
                table: "TeamMembers");
        }
    }
}
