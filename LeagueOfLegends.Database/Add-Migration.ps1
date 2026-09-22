param([Parameter(Mandatory = $true)][string]$Name)
$ErrorActionPreference = "Stop"
Write-Host "Adding EF Core migration '$Name'..." -ForegroundColor Cyan
dotnet ef migrations add $Name `
  --project .\LeagueOfLegends.Database.csproj `
  --startup-project ..\LeagueOfLegends.Consumer\LeagueOfLegends.Consumer.csproj
