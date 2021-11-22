using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DragLanSeatPicker.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace DragLanSeatPicker.Controllers
{
    public static class SeatsController
    {
        [FunctionName("Reserve")]
        public static async Task<IActionResult> Post(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "seats")]
            HttpRequest request,
            [CosmosDB(
                databaseName: "draglan",
                collectionName: "seats",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            await AuthUtils.Authorize(request);

            var seatId = GetRequestBody(request).ToLower();

            if (string.IsNullOrWhiteSpace(seatId)) return new BadRequestResult();

            var userId = request.HttpContext.User.Claims.First(claim => claim.Type == "Id").Value;

            if (await FindSeatBySeatId(client, seatId) != null) return new ConflictResult();
            if (await FindSeatByUserId(client, userId) != null) return new ConflictResult();

            var seat = new Seat
            {
                Id = seatId,
                Name = request.HttpContext.User.Claims.First(claim => claim.Type == "Name").Value,
                UserId = userId,
            };

            await CreateSeat(client, seat);

            return new AcceptedResult();
        }

        [FunctionName("Unreserve")]
        public static async Task<IActionResult> Delete(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "seats/{id}")]
            HttpRequest request,
            [CosmosDB(
                databaseName: "draglan",
                collectionName: "seats",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            await AuthUtils.Authorize(request);

            string seatId;
            {
                var split = request.Path.Value.Split("/");
                seatId = split[split.Length - 1].ToLower();
            }

            if (string.IsNullOrWhiteSpace(seatId)) return new BadRequestResult();

            var userId = request.HttpContext.User.Claims.First(claim => claim.Type == "Id").Value;

            if (await FindSeatBySeatId(client, seatId) == null) return new NotFoundResult();
            if (await FindSeatByUserId(client, userId) == null) return new UnauthorizedResult();

            await DeleteSeat(client, seatId);

            return new OkResult();
        }

        [FunctionName("GetReservedSeats")]
        public static async Task<IActionResult> Get(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "seats")]
            HttpRequest request,
            [CosmosDB(
                "draglan",
                "seats",
                ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "seats");
            var query = client.CreateDocumentQuery(collectionUri)
                .AsDocumentQuery();

            var seats = new List<Seat>();
            while (query.HasMoreResults)
            {
                seats.AddRange((await query.ExecuteNextAsync()).Select(seat => (Seat) seat));
            }

            return new OkObjectResult(seats);
        }

        private static async Task<Seat> FindSeatByUserId(DocumentClient client, string userId)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "seats");
            var query = client
                .CreateDocumentQuery<Seat>(collectionUri, new FeedOptions() { EnableCrossPartitionQuery = true })
                .Where(x => x.UserId == userId)
                .AsDocumentQuery();

            while (query.HasMoreResults)
            {
                foreach (var seat in await query.ExecuteNextAsync())
                {
                    return seat;
                }
            }

            return null;
        }

        private static async Task DeleteSeat(IDocumentClient client, string seatId)
        {
            var collectionUri = UriFactory.CreateDocumentUri("draglan", "seats", seatId);
            await client.DeleteDocumentAsync(collectionUri, new RequestOptions() { PartitionKey = new PartitionKey(seatId) });
        }

        private static async Task CreateSeat(IDocumentClient client, Seat seat)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "seats");
            await client.CreateDocumentAsync(collectionUri, seat);
        }

        private static async Task<Seat> FindSeatBySeatId(IDocumentClient client, string id)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("draglan", "seats");
            var query = client.CreateDocumentQuery(collectionUri)
                .Where(x => x.Id == id)
                .AsDocumentQuery();

            while (query.HasMoreResults)
            {
                foreach (var seat in await query.ExecuteNextAsync())
                {
                    return seat;
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