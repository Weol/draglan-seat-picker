using System;
using Newtonsoft.Json;

namespace DragLanSeatPicker.Models.User
{
    public class User
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("is_admin")]
        public bool IsAdmin { get; set; }
    }
}