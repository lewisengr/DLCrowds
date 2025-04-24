using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ThemeParksController(ThemeParksService themeParksService) : ControllerBase
{
    private readonly ThemeParksService _themeParksService = themeParksService;

    [HttpGet("destinations")]
    public async Task<IActionResult> GetDestinations()
    {
        var data = await _themeParksService.GetDestinationsAsync();
        return Ok(data);
    }
}