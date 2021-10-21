using System;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using DragLanSeatPicker.SigningService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.DependencyInjection;

internal class AuthorizeAttribute : FunctionInvocationFilterAttribute
{
    public override async Task OnExecutingAsync(FunctionExecutingContext executingContext,
        CancellationToken cancellationToken)
    {
        var request = (HttpRequest) executingContext.Arguments["request"];

        var tokenService = request.HttpContext.RequestServices.GetRequiredService<ITokenService>();

        if (!request.Headers.TryGetValue("Authorization", out var value))
        {
            HandleUnauthorizedRequest(request);
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
            HandleUnauthorizedRequest(request);
        }
    }

    private async void HandleUnauthorizedRequest(HttpRequest request)
    {
        request.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await request.HttpContext.Response.Body.FlushAsync();
        request.HttpContext.Response.Body.Close();
        throw new UnauthorizedAccessException();
    }
}