using System.Text.Json;
using System.Text.Json.Serialization;

namespace TaskShifter.Shared.Serializers;

public static class JsonSerializerProfile
{
    public static JsonSerializerOptions CamelCaseIgnoreNull => new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
}
