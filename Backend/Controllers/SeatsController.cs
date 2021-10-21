using DragLanSeatPicker.Models.Seat;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers 
{
    public static class SeatsController
    {
        [Authorize]
        [FunctionName("Reserve")]
        public static IActionResult PutSeat(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "seats/{id:int}")] Seat seat, 
            HttpRequest request,
            [CosmosDB(databaseName: "draglan", collectionName: "seats", ConnectionStringSetting = "CosmosDBConnection")] out dynamic document,
            ILogger log)
        {
            document = seat;
            return new AcceptedResult();
        }
    }
}