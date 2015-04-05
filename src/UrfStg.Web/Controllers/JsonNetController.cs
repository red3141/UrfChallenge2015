using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace UrfStg.Web.Controllers
{
    public class JsonNetController : Controller
    {
        /// <summary>
        /// Creates a JsonNetResult that serializes an object to JSON using Newtonsoft.Json.
        /// </summary>
        /// <returns></returns>
        protected JsonNetResult JsonNet(object data)
        {
            return JsonNet(data, null);
        }

        /// <summary>
        /// Creates a JsonNetResult that serializes an object to JSON using Newtonsoft.Json.
        /// </summary>
        /// <returns></returns>
        protected JsonNetResult JsonNet(object data, string contentType)
        {
            return JsonNet(data, contentType, null);
        }

        /// <summary>
        /// Creates a JsonNetResult that serializes an object to JSON using Newtonsoft.Json.
        /// </summary>
        /// <returns></returns>
        protected virtual JsonNetResult JsonNet(object data, string contentType, Encoding contentEncoding)
        {
            return JsonNet(data, contentType, contentEncoding, JsonRequestBehavior.DenyGet);
        }

        /// <summary>
        /// Creates a JsonNetResult that serializes an object to JSON using Newtonsoft.Json.
        /// </summary>
        /// <returns></returns>
        protected JsonNetResult JsonNet(object data, JsonRequestBehavior behaviour)
        {
            return JsonNet(data, null, behaviour);
        }

        /// <summary>
        /// Creates a JsonNetResult that serializes an object to JSON using Newtonsoft.Json.
        /// </summary>
        /// <returns></returns>
        protected JsonNetResult JsonNet(object data, string contentType, JsonRequestBehavior behaviour)
        {
            return JsonNet(data, contentType, null, behaviour);
        }

        /// <summary>
        /// Creates a JsonNetResult that serializes an object to JSON using Newtonsoft.Json.
        /// </summary>
        /// <returns></returns>
        protected virtual JsonNetResult JsonNet(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior behaviour)
        {
            return new JsonNetResult { Data = data, ContentType = contentType, ContentEncoding = contentEncoding, JsonRequestBehavior = behaviour };
        }
    }
}