using System;
using System.Collections.Generic;
using System.Linq;
//using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Serialization;
using UrfStg.Web.Converters;

namespace UrfStg.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Use camel case for JSON data.
            /*config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new TimeSpanConverter());

            // Use XmlSerializer to make [XmlIgnore] attributes work.
            config.Formatters.XmlFormatter.UseXmlSerializer = true;*/

            // Web API routes
            config.Routes.MapHttpRoute(
                name: "Default",
                routeTemplate: "{controller}/{action}"
            );
        }
    }
}
