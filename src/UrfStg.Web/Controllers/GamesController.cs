using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
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
        private readonly Random random;

        public GamesController()
            : this(new RiotDataContext())
        { }

        public GamesController(IRiotDataContext dataContext)
        {
            if (dataContext == null)
                throw new ArgumentNullException("dataContext");
            this.dataContext = dataContext;

            random = new Random();
        }

        /// <summary>
        /// Gets a random game.
        /// </summary>
        /// <returns>A <see cref="Match"/>.</returns>
        [Route("api/games/random")]
        public Match GetRandomGame()
        {
            var ids = dataContext.Matches.Select(m => m.Id).ToList();

            // Try to re-use the same random number generator to avoid burdening the garbage collector.
            // However, if it is already in use by another thread, then just create a new one.
            int index;
            var useMonitor = Monitor.TryEnter(random);
            try
            {
                var currentRandom = useMonitor ? random : new Random();
                index = random.Next(ids.Count);
            }
            finally
            {
                if (useMonitor)
                    Monitor.Exit(random);
            }
            var selectedId = ids[index];
            var match = dataContext.Matches.Find(selectedId);

            return match;
        }
    }
}
