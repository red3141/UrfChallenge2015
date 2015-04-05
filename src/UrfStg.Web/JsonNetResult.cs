using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace UrfStg.Web
{
    /// <summary>
    /// Represents a class that is used to send JSON-formatted content (serialized with Newtonsoft.JSON) to the response.
    /// </summary>
    public class JsonNetResult : JsonResult
    {
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            var response = context.HttpContext.Response;

            response.ContentType = !String.IsNullOrEmpty(ContentType)
                ? ContentType
                : "application/json";

            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;

            var serializer = JsonSerializer.CreateDefault();
            using (var writer = new StreamWriter(response.OutputStream))
            {
                serializer.Serialize(writer, Data);
            }
        }
    }
}