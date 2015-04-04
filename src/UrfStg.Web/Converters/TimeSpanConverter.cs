using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace UrfStg.Web.Converters
{
    public class TimeSpanConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(TimeSpan) || objectType == typeof(TimeSpan?);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == null)
                return null;
            if (reader.TokenType == JsonToken.Integer)
            {
                var value = (long)reader.Value;
                return TimeSpan.FromMilliseconds(value);
            }
            if (reader.TokenType == JsonToken.Float)
            {
                var value = (double)reader.Value;
                return TimeSpan.FromMilliseconds(value);
            }
            if (reader.TokenType == JsonToken.String)
            {
                var value = (string)reader.Value;
                return TimeSpan.Parse(value);
            }
            throw new JsonException("Unexpected token type while reading TimeSpan: " + reader.TokenType);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var timeSpan = value as TimeSpan?;
            if (timeSpan == null)
            {
                writer.WriteNull();
                return;
            }
            writer.WriteValue(timeSpan.Value.TotalMilliseconds);
        }
    }
}