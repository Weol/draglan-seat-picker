using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using DragLanSeatPicker.Models;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;

namespace DragLanSeatPicker.Services.TokenService
{
    public class RsaTokenService : ITokenService
    {
        public string Sign(User user)
        {
            var key = Environment.GetEnvironmentVariable("UserPrivateKey", EnvironmentVariableTarget.Process);
            using var rsa = RSA.Create();
            rsa.ImportRSAPrivateKey(Convert.FromBase64String(key), out var bytesRead);
            var securityKey = new RsaSecurityKey(rsa);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.RsaSha256);

            var header = new JwtHeader(credentials);
            var payload = new JwtPayload
            {
                {"id", user.Id},
                {"name", user.Name}
            };

            IdentityModelEventSource.ShowPII = true;
            var secToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();

            return handler.WriteToken(secToken);
        }

        public string SignAdmin(User user)
        {
            throw new NotImplementedException();
        }

        public User Verify(string token)
        {
            var key = Environment.GetEnvironmentVariable("UserPublicKey", EnvironmentVariableTarget.Process);

            using var rsa = RSA.Create();
            rsa.ImportSubjectPublicKeyInfo(Convert.FromBase64String(key), out var bytesRead);

            var securityKey = new RsaSecurityKey(rsa);

            var handler = new JwtSecurityTokenHandler();
            IdentityModelEventSource.ShowPII = true;
            handler.ValidateToken(token, new TokenValidationParameters
            {
                IssuerSigningKey = securityKey,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false,
                ValidateAudience = false,
                ValidateActor = false,
                ValidateIssuer = false
            }, out SecurityToken validatedToken);

            var jwtSecurityToken = (JwtSecurityToken) validatedToken;
                
            return new User
            {
                Id = jwtSecurityToken.Payload["id"].ToString(),
                Name = jwtSecurityToken.Payload["name"].ToString(),
            };
        }

        public User VerifyAdmin(string token)
        {
            return null;
        }
    }
}