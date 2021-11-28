using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DragLanSeatPicker.Services.TokenService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using User = DragLanSeatPicker.Models.User;

namespace DragLanSeatPicker.Controllers
{
    using System.Security.Cryptography;

    public class UserController
    {
        private ITokenService _tokenService;

        public UserController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [FunctionName("Login")]
        public async Task<IActionResult> Login(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "login")]
            User requestUser,
            [CosmosDB(
                databaseName: "draglan",
                collectionName: "users",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            var user = await FindUser(client, requestUser.Id);
            if (user is null || user.Password != requestUser.Password) return new UnauthorizedResult();

            var signature = user.IsAdmin
                    ? _tokenService.SignAdmin(user)
                    : _tokenService.Sign(user);

            return new OkObjectResult(new {id = user.Id, is_admin = user.IsAdmin, name = user.Name, token = signature});
        }

        [FunctionName("Signup")]
        public async Task<IActionResult> Signup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "signup")]
            User user,
            [CosmosDB(
                "draglan",
                "users",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            if (string.IsNullOrWhiteSpace(user.Id) || string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Password))
                return new BadRequestResult();

            if (user.IsAdmin) return new UnauthorizedResult();

            if (await FindUser(client, user.Id) != null) return new ConflictResult();

            await CreateUser(client, user);

            return new AcceptedResult();
        }

        private static async Task CreateUser(IDocumentClient client, User user)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "users");
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

        private static string GetRequestBody(HttpRequest request)
        {
            var bodyStream = new StreamReader(request.Body);
            bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);
            var bodyText = bodyStream.ReadToEnd();
            return bodyText;
        }
    }
}