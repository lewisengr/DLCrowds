using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

public class ThemeParksService
{
    private readonly HttpClient _httpClient;

    public ThemeParksService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<JsonDocument> GetDestinationsAsync()
    {
        var response = await _httpClient.GetAsync("https://api.themeparks.wiki/v1/destinations");
        response.EnsureSuccessStatusCode();

        var jsonString = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(jsonString); // Or deserialize to a model

        return jsonDoc;
    }
}