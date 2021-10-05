using DragLanSeatPicker.Models.Seat;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers 
{
    public static class SeatsController
    {
        [FunctionName("PutSeat")]
        public static IActionResult PutSeat(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "seats/{id:int}")] HttpSeatModel seat, 
            [CosmosDB(databaseName: "ToDoItems", collectionName: "Items", ConnectionStringSetting = "CosmosDBConnection")] out dynamic document,
            ILogger log)
        {
            document = new CosmosSeatModel
            {
                Id = seat.Id, 
                Mail = seat.Mail,
                Name = seat.Name,
                Password = seat.Password
            };

            return new AcceptedResult();
        }
    }
}