using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using UrfStg.Web.Converters;

namespace UrfStg.Web
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            /*var config = GlobalConfiguration.Configuration;
            Console.WriteLine("Got config.");
            Console.WriteLine(config.GetType().Name);
            WebApiConfig.Register(config);*/
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            // Remove the default JSON provider and use a special model binder instead.
            // This allows us to use strongly typed deserialization.
            ValueProviderFactories.Factories.Remove(ValueProviderFactories.Factories.OfType<JsonValueProviderFactory>().FirstOrDefault());
            ModelBinders.Binders.DefaultBinder = new JsonNetModelBinder();

            var settings = new JsonSerializerSettings {  ContractResolver = new CamelCasePropertyNamesContractResolver() };
            settings.Converters.Add(new TimeSpanConverter());
            JsonConvert.DefaultSettings = () => settings;
        }
    }
}
