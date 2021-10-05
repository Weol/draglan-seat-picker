using System;
using Newtonsoft.Json;

namespace DragLanSeatPicker.Models.Seat
{
    public class HttpSeatModel
    {
        [JsonProperty("name")]
        public Guid Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Mail { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; } 
    }
}