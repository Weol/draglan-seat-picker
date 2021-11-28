namespace DragLanSeatPicker.Controllers
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Extensions.WebPubSub;

    public class PubSub
    {
        [FunctionName("pubsub")]
        public static WebPubSubConnection GetClientConnection(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
            [WebPubSubConnection(UserId = "{query.userid}", Hub = "seats")] WebPubSubConnection connection)
        {
            return connection;
        }

    }
}