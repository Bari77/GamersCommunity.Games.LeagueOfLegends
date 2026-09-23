using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeagueOfLegends.Database.Migrations
{
    /// <inheritdoc />
    public partial class DropCatalogEntitled : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Entitled",
                table: "Regions");

            migrationBuilder.DropColumn(
                name: "Entitled",
                table: "PlayerChampionKinds");

            migrationBuilder.DropColumn(
                name: "Entitled",
                table: "Lanes");

            migrationBuilder.DropColumn(
                name: "Entitled",
                table: "Champions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Entitled",
                table: "Regions",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Entitled",
                table: "PlayerChampionKinds",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Entitled",
                table: "Lanes",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Entitled",
                table: "Champions",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 1,
                column: "Entitled",
                value: "Aatrox");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 2,
                column: "Entitled",
                value: "Ahri");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 3,
                column: "Entitled",
                value: "Akali");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 4,
                column: "Entitled",
                value: "Alistar");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 5,
                column: "Entitled",
                value: "Amumu");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 6,
                column: "Entitled",
                value: "Anivia");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 7,
                column: "Entitled",
                value: "Annie");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 8,
                column: "Entitled",
                value: "Aphelios");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 9,
                column: "Entitled",
                value: "Ashe");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 10,
                column: "Entitled",
                value: "Azir");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 11,
                column: "Entitled",
                value: "Bard");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 12,
                column: "Entitled",
                value: "Blitzcrank");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 13,
                column: "Entitled",
                value: "Brand");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 14,
                column: "Entitled",
                value: "Braum");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 15,
                column: "Entitled",
                value: "Caitlyn");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 16,
                column: "Entitled",
                value: "Camille");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 17,
                column: "Entitled",
                value: "Cassiopeia");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 18,
                column: "Entitled",
                value: "Darius");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 19,
                column: "Entitled",
                value: "Diana");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 20,
                column: "Entitled",
                value: "Draven");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 21,
                column: "Entitled",
                value: "Ekko");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 22,
                column: "Entitled",
                value: "Evelynn");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 23,
                column: "Entitled",
                value: "Ezreal");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 24,
                column: "Entitled",
                value: "Fiora");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 25,
                column: "Entitled",
                value: "Fizz");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 26,
                column: "Entitled",
                value: "Gnar");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 27,
                column: "Entitled",
                value: "Graves");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 28,
                column: "Entitled",
                value: "Hecarim");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 29,
                column: "Entitled",
                value: "Illaoi");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 30,
                column: "Entitled",
                value: "Irelia");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 31,
                column: "Entitled",
                value: "Janna");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 32,
                column: "Entitled",
                value: "Jarvan IV");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 33,
                column: "Entitled",
                value: "Jax");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 34,
                column: "Entitled",
                value: "Jhin");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 35,
                column: "Entitled",
                value: "Jinx");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 36,
                column: "Entitled",
                value: "Kai'Sa");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 37,
                column: "Entitled",
                value: "Karma");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 38,
                column: "Entitled",
                value: "Kassadin");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 39,
                column: "Entitled",
                value: "Katarina");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 40,
                column: "Entitled",
                value: "Kayle");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 41,
                column: "Entitled",
                value: "Kayn");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 42,
                column: "Entitled",
                value: "Kha'Zix");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 43,
                column: "Entitled",
                value: "Kindred");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 44,
                column: "Entitled",
                value: "LeBlanc");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 45,
                column: "Entitled",
                value: "Lee Sin");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 46,
                column: "Entitled",
                value: "Leona");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 47,
                column: "Entitled",
                value: "Lulu");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 48,
                column: "Entitled",
                value: "Lux");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 49,
                column: "Entitled",
                value: "Malphite");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 50,
                column: "Entitled",
                value: "Miss Fortune");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 51,
                column: "Entitled",
                value: "Mordekaiser");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 52,
                column: "Entitled",
                value: "Morgana");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 53,
                column: "Entitled",
                value: "Nami");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 54,
                column: "Entitled",
                value: "Nasus");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 55,
                column: "Entitled",
                value: "Nautilus");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 56,
                column: "Entitled",
                value: "Nidalee");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 57,
                column: "Entitled",
                value: "Orianna");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 58,
                column: "Entitled",
                value: "Ornn");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 59,
                column: "Entitled",
                value: "Pyke");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 60,
                column: "Entitled",
                value: "Rakan");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 61,
                column: "Entitled",
                value: "Renekton");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 62,
                column: "Entitled",
                value: "Riven");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 63,
                column: "Entitled",
                value: "Senna");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 64,
                column: "Entitled",
                value: "Seraphine");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 65,
                column: "Entitled",
                value: "Sett");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 66,
                column: "Entitled",
                value: "Sion");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 67,
                column: "Entitled",
                value: "Sivir");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 68,
                column: "Entitled",
                value: "Sona");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 69,
                column: "Entitled",
                value: "Soraka");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 70,
                column: "Entitled",
                value: "Syndra");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 71,
                column: "Entitled",
                value: "Thresh");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 72,
                column: "Entitled",
                value: "Tristana");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 73,
                column: "Entitled",
                value: "Twitch");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 74,
                column: "Entitled",
                value: "Varus");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 75,
                column: "Entitled",
                value: "Vayne");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 76,
                column: "Entitled",
                value: "Veigar");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 77,
                column: "Entitled",
                value: "Viego");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 78,
                column: "Entitled",
                value: "Viktor");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 79,
                column: "Entitled",
                value: "Warwick");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 80,
                column: "Entitled",
                value: "Xayah");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 81,
                column: "Entitled",
                value: "Xin Zhao");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 82,
                column: "Entitled",
                value: "Yasuo");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 83,
                column: "Entitled",
                value: "Yone");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 84,
                column: "Entitled",
                value: "Yuumi");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 85,
                column: "Entitled",
                value: "Zed");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 86,
                column: "Entitled",
                value: "Zeri");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 87,
                column: "Entitled",
                value: "Zoe");

            migrationBuilder.UpdateData(
                table: "Champions",
                keyColumn: "Id",
                keyValue: 88,
                column: "Entitled",
                value: "Zyra");

            migrationBuilder.UpdateData(
                table: "Lanes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Entitled",
                value: "Top");

            migrationBuilder.UpdateData(
                table: "Lanes",
                keyColumn: "Id",
                keyValue: 2,
                column: "Entitled",
                value: "Jungle");

            migrationBuilder.UpdateData(
                table: "Lanes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Entitled",
                value: "Mid");

            migrationBuilder.UpdateData(
                table: "Lanes",
                keyColumn: "Id",
                keyValue: 4,
                column: "Entitled",
                value: "Bottom");

            migrationBuilder.UpdateData(
                table: "Lanes",
                keyColumn: "Id",
                keyValue: 5,
                column: "Entitled",
                value: "Support");

            migrationBuilder.UpdateData(
                table: "PlayerChampionKinds",
                keyColumn: "Id",
                keyValue: 1,
                column: "Entitled",
                value: "Main");

            migrationBuilder.UpdateData(
                table: "PlayerChampionKinds",
                keyColumn: "Id",
                keyValue: 2,
                column: "Entitled",
                value: "Pool");

            migrationBuilder.UpdateData(
                table: "PlayerChampionKinds",
                keyColumn: "Id",
                keyValue: 3,
                column: "Entitled",
                value: "Learning");

            migrationBuilder.UpdateData(
                table: "Regions",
                keyColumn: "Id",
                keyValue: 1,
                column: "Entitled",
                value: "EU West");

            migrationBuilder.UpdateData(
                table: "Regions",
                keyColumn: "Id",
                keyValue: 2,
                column: "Entitled",
                value: "EU Nordic & East");

            migrationBuilder.UpdateData(
                table: "Regions",
                keyColumn: "Id",
                keyValue: 3,
                column: "Entitled",
                value: "North America");

            migrationBuilder.UpdateData(
                table: "Regions",
                keyColumn: "Id",
                keyValue: 4,
                column: "Entitled",
                value: "Korea");
        }
    }
}
