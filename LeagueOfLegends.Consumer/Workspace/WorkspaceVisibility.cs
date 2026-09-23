using System.Text;
using System.Text.Json;

namespace LeagueOfLegends.Consumer.Workspace;

/// <summary>
/// Trims a saved workspace down to the pages a visitor may open. The layout reaches the browser
/// whole, so a page kept out of reach has to be dropped here rather than hidden by the front end.
/// </summary>
public static class WorkspaceVisibility
{
    private const string PagesProperty = "pages";
    private const string VisibilityProperty = "visibility";

    /// <summary>
    /// Rewrites <paramref name="layoutJson"/> without the pages <paramref name="allows"/> rejects.
    /// A page without a visibility is open to everyone. Layouts that are not a paged workspace are
    /// returned untouched, as are malformed ones: the front end already falls back to its default.
    /// </summary>
    public static string? Filter(string? layoutJson, Func<string?, bool> allows)
    {
        if (string.IsNullOrWhiteSpace(layoutJson))
            return layoutJson;

        try
        {
            using var document = JsonDocument.Parse(layoutJson);
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object
                || !root.TryGetProperty(PagesProperty, out var pages)
                || pages.ValueKind != JsonValueKind.Array)
                return layoutJson;

            var kept = pages.EnumerateArray().Where(page => allows(VisibilityOf(page))).ToList();
            if (kept.Count == pages.GetArrayLength())
                return layoutJson;

            using var buffer = new MemoryStream();
            using (var writer = new Utf8JsonWriter(buffer))
            {
                writer.WriteStartObject();
                foreach (var property in root.EnumerateObject())
                {
                    if (property.NameEquals(PagesProperty))
                        continue;

                    property.WriteTo(writer);
                }

                writer.WriteStartArray(PagesProperty);
                foreach (var page in kept)
                    page.WriteTo(writer);
                writer.WriteEndArray();

                writer.WriteEndObject();
            }

            return Encoding.UTF8.GetString(buffer.ToArray());
        }
        catch (JsonException)
        {
            return layoutJson;
        }
    }

    private static string? VisibilityOf(JsonElement page)
    {
        return page.ValueKind == JsonValueKind.Object
               && page.TryGetProperty(VisibilityProperty, out var visibility)
               && visibility.ValueKind == JsonValueKind.String
            ? visibility.GetString()
            : null;
    }
}
