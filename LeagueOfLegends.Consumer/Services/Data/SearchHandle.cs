namespace LeagueOfLegends.Consumer.Services.Data;

internal static class SearchHandle
{
    public static (string Name, string? Discriminator) Split(string query)
    {
        var trimmed = query.Trim();
        var separator = trimmed.LastIndexOf('#');
        if (separator <= 0 || separator == trimmed.Length - 1)
            return (trimmed, null);

        return (trimmed[..separator], trimmed[(separator + 1)..]);
    }
}
