using Newtonsoft.Json;

namespace DragLanSeatPicker.Models
{
    public class Seat
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("user")]
        public string UserId { get; set; }
    }
}