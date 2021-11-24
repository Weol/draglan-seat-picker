using System;
using System.Security.Cryptography;
using DragLanSeatPicker.Models;

namespace DragLanSeatPicker.Services.TokenService
{
    using System.IO;
    using System.Text;
    using Newtonsoft.Json;

    public class RsaTokenService : ITokenService
    {
        public string Sign(User user)
        {
            var key = Environment.GetEnvironmentVariable("UserPrivateKey");
            using var rsa = RSA.Create();
            rsa.ImportRSAPrivateKey(Convert.FromBase64String(key), out var bytesRead);

            var payload = JsonConvert.SerializeObject(user);
            var signature = rsa.SignData(Encoding.UTF8.GetBytes(payload), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);

            var stream = new MemoryStream();
            using (var writer = new BinaryWriter(stream))
            {
                writer.Write(signature.Length);
                writer.Write(signature);
                writer.Write(payload);
            }
            var token = Convert.ToBase64String(stream.ToArray());

            return token;
        }

        public string SignAdmin(User user)
        {
            throw new NotImplementedException();
        }

        public User Verify(string token)
        {
            var key = Environment.GetEnvironmentVariable("UserPublicKey");

            using var rsa = RSA.Create();
            rsa.ImportRSAPublicKey(Convert.FromBase64String(key), out var bytesRead);

            var tokenBytes = Convert.FromBase64String(token);

            string payloadJson;
            byte[] signature;
            using (var reader = new BinaryReader(new MemoryStream(tokenBytes)))
            {
                var len = reader.ReadInt32();
                signature = reader.ReadBytes(len);
                payloadJson = reader.ReadString();
            }

            var verified = rsa.VerifyData(Encoding.UTF8.GetBytes(payloadJson), signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            if (!verified) return null;

            return JsonConvert.DeserializeObject<User>(payloadJson);
        }

        public User VerifyAdmin(string token)
        {
            return null;
        }
    }
}