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
    /// An extension of the default model binder that deserializes application/json data 
    /// </summary>
    public class JsonNetModelBinder : DefaultModelBinder
    {
        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            bool isJsonRequest = controllerContext.HttpContext.Request.ContentType.StartsWith("application/json", StringComparison.InvariantCultureIgnoreCase);
            if (!isJsonRequest || (!string.IsNullOrEmpty(bindingContext.ModelName) && bindingContext.ValueProvider.ContainsPrefix(bindingContext.ModelName)))
            {
                // Not a JSON request, or one of the ValueProviders found the prefix, meaning that one of the default value binders can handle this model.
                // Use the default model binder.
                return base.BindModel(controllerContext, bindingContext);
            }
            // Prefix was not found. Try reading JSON from the request body.
            var streamReader = new StreamReader(controllerContext.HttpContext.Request.InputStream);
            var jsonReader = new JsonTextReader(streamReader);
            var serializer = JsonSerializer.CreateDefault();
            var result = serializer.Deserialize(jsonReader, bindingContext.ModelType);
            return result;
        }
    }
}