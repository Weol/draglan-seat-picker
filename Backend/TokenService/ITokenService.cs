using System;
using DragLanSeatPicker.Models.User;
using Microsoft.IdentityModel.Tokens;

namespace DragLanSeatPicker.SigningService
{
    public interface ITokenService
    {
        public string Sign(User user);

        public string SignAdmin(User user);
        
        public User Verify(string token);

        public User VerifyAdmin(string token);
    }
}