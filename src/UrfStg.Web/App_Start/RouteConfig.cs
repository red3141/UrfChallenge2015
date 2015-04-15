using System.Web.Mvc;
using System.Web.Routing;

namespace UrfStg.Web
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "DefaultRandom",
                url: "{controller}/random",
                defaults: new { controller = "Home", action = "Random", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DefaultById",
                url: "{controller}/{id}",
                defaults: new { controller = "Home", action = "Index", id = -1L }
            );
        }
    }
}