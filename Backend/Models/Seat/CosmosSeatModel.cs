using System;
using Newtonsoft.Json;

namespace DragLanSeatPicker.Models.Seat
{
    public class CosmosSeatModel : HttpSeatModel
    {
        [JsonProperty("partitionKey")]
        public string PartitionKey => "partitionKey";
    }
}