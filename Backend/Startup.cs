using DragLanSeatPicker.SigningService;
using DragLanSeatPicker.TokenService;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(DragLanSeatPicker.Startup))]

namespace DragLanSeatPicker
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<ITokenService, RsaTokenService>();
        }
    }
}