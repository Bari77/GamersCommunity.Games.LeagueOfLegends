# Build from this game repo only (Core from GitHub NuGet Packages).

FROM mcr.microsoft.com/dotnet/runtime:10.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG GITHUB_TOKEN=
WORKDIR /src

COPY nuget.config ./
COPY LeagueOfLegends.Consumer/LeagueOfLegends.Consumer.csproj LeagueOfLegends.Consumer/
COPY LeagueOfLegends.Database/LeagueOfLegends.Database.csproj LeagueOfLegends.Database/

RUN if [ -n "$GITHUB_TOKEN" ]; then \
      dotnet nuget update source github \
        --username "x-access-token" \
        --password "$GITHUB_TOKEN" \
        --store-password-in-clear-text; \
    fi \
    && dotnet restore "LeagueOfLegends.Consumer/LeagueOfLegends.Consumer.csproj"

COPY LeagueOfLegends.Consumer/ LeagueOfLegends.Consumer/
COPY LeagueOfLegends.Database/ LeagueOfLegends.Database/
WORKDIR /src/LeagueOfLegends.Consumer
RUN dotnet publish "LeagueOfLegends.Consumer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LeagueOfLegends.Consumer.dll"]
