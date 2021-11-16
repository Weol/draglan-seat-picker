using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using DragLanSeatPicker.Services.TokenService;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.DependencyInjection;

namespace DragLanSeatPicker
{
    internal static class AuthUtils
    {
        public static async Task Authorize(HttpRequest request)
        {
            var tokenService = request.HttpContext.RequestServices.GetRequiredService<ITokenService>();

            if (!request.Headers.TryGetValue("Auth", out var value))
            {
                await HandleUnauthorizedRequest(request);
            }

            var token = value[0];
            var user = tokenService.Verify(token) ?? tokenService.VerifyAdmin(token);

            if (user != null)
            {
                var identity = new ClaimsIdentity(
                    new GenericIdentity(user.Name, "JwtTokenAuthentication"),
                    new Claim[]
                    {
                        new Claim("Name", user.Name),
                        new Claim("Id", user.Id)
                    });
            
                request.HttpContext.User.AddIdentity(identity);
            }
            else
            {
                await HandleUnauthorizedRequest(request);
            }
        }

        private static async Task HandleUnauthorizedRequest(HttpRequest request)
        {
            request.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await request.HttpContext.Response.Body.FlushAsync();
            request.HttpContext.Response.Body.Close();
            throw new Exception("Not authorized");
        }
    }
}