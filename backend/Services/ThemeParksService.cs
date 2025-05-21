using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

/// <summary>
/// Service to interact with the ThemeParks API.
/// </summary>
/// <param name="httpClient"></param>
public class ThemeParksService(HttpClient httpClient)
{
    private readonly HttpClient _httpClient = httpClient;

    // Asynchronously retrieves a list of destinations from the ThemeParks API.
    public async Task<JsonDocument> GetDestinationsAsync()
    {
        var response = await _httpClient.GetAsync("https://api.themeparks.wiki/v1/destinations");
        response.EnsureSuccessStatusCode();

        var jsonString = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(jsonString); // Or deserialize to a model

        return jsonDoc;
    }
}