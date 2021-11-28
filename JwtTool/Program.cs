// See https://aka.ms/new-console-template for more information

using System;
using System.Security.Cryptography;

var rsa = RSA.Create();

Console.WriteLine("Private: " + Convert.ToBase64String(rsa.ExportRSAPrivateKey()));
Console.WriteLine("Public: " + Convert.ToBase64String(rsa.ExportRSAPublicKey()));
