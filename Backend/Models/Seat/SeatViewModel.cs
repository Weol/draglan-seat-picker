using System;

namespace DragLanSeatPicker.Models.Seat
{
    public class SeatViewModel
    {
        private Guid Id { get; set; }
        
        private string OccupiedBy { get; set; }

        public int X { get; set; }
        
        public int Y { get; set; }

        public int Direction { get; set; }
    }
}