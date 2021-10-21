using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DragLanSeatPicker.SigningService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using User = DragLanSeatPicker.Models.User.User;

namespace DragLanSeatPicker.Controllers
{
    public class UserController
    {
        private ITokenService _tokenService;

        public UserController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [FunctionName("Login")]
        public async Task<IActionResult> Login(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "login")]
            HttpRequest request,
            [CosmosDB(
                databaseName: "draglan",
                collectionName: "users",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            var id = GetRequestBody(request);

            var user = await FindUser(client, id);
            if (user is null) return new UnauthorizedResult();

            try
            {
                return user.IsAdmin
                    ? new OkObjectResult(_tokenService.SignAdmin(user))
                    : new OkObjectResult(_tokenService.Sign(user));
            }
            catch (ValidationException e)
            {
                return new UnauthorizedResult();
            }
        }

        [FunctionName("Signup")]
        public async Task<IActionResult> Signup(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "signup")] User user,
            [CosmosDB(
                "draglan",
                "users",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            if (user.IsAdmin) return new UnauthorizedResult();

            if (await FindUser(client, user.Id) != null) return new ConflictResult();

            await CreateUser(client, user);

            return new AcceptedResult();
        }

        private static async Task CreateUser(IDocumentClient client, User user)
        {
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "users");
            await client.CreateDocumentAsync(collectionUri, user); 
        }

        private static async Task<User> FindUser(IDocumentClient client, string id)
        {
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "users");
            var query = client.CreateDocumentQuery(collectionUri)
                .Where(x => x.Id == id)
                .AsDocumentQuery();

            while (query.HasMoreResults)
            {
                foreach (var user in await query.ExecuteNextAsync())
                {
                    return user;
                }
            }

            return null;
        }

        public static string GetRequestBody(HttpRequest request)
        {
            var bodyStream = new StreamReader(request.Body);
            bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);
            var bodyText = bodyStream.ReadToEnd();
            return bodyText;
        }
    }
}