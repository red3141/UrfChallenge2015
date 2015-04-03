using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using UrfStg.Model;

namespace UrfStg.Web.Controllers
{
    /// <summary>
    /// Contains routes for accessing game data.
    /// </summary>
    public class GamesController : ApiController
    {
        private IRiotDataContext dataContext;

        public GamesController()
            : this(new RiotDataContext())
        { }

        public GamesController(IRiotDataContext dataContext)
        {
            if (dataContext == null)
                throw new ArgumentNullException("dataContext");
            this.dataContext = dataContext;
        }

        /// <summary>
        /// Gets a random game.
        /// </summary>
        /// <returns>A <see cref="Match"/>.</returns>
        [Route("api/games/random")]
        public Match GetRandom()
        {
            // TODO: implement
            return null;
        }
    }
}
