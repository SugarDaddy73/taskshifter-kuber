using System.Security.Cryptography;
using System.Text;

namespace TaskShifter.Shared.Utils;

public static class HashUtil
{
    public static string ToSha256(string inputString)
    {
        SHA256 crypt = SHA256.Create();
        StringBuilder hashBuilder = new();
        byte[] crypto = crypt.ComputeHash(Encoding.ASCII.GetBytes(inputString));
        foreach (byte @byte in crypto)
        {
            hashBuilder.Append(@byte.ToString("x2"));
        }

        return hashBuilder.ToString();
    }
}
