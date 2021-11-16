using DragLanSeatPicker.Models;

namespace DragLanSeatPicker.Services.TokenService
{
    public interface ITokenService
    {
        public string Sign(User user);

        public string SignAdmin(User user);
        
        public User Verify(string token);

        public User VerifyAdmin(string token);
    }
}