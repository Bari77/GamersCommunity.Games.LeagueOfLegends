using System.Text.Json;

namespace LeagueOfLegends.Consumer.Services;

public static class RequestPayload
{
    public static HashSet<string> SentFields(string data)
    {
        using var document = JsonDocument.Parse(data);
        if (document.RootElement.ValueKind is not JsonValueKind.Object)
            return [];

        return new HashSet<string>(
            document.RootElement.EnumerateObject().Select(property => property.Name),
            StringComparer.OrdinalIgnoreCase);
    }
}
