﻿using Newtonsoft.Json;

namespace DragLanSeatPicker.Models
{
    public class User
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("is_admin")]
        public bool IsAdmin { get; set; }
    }
}