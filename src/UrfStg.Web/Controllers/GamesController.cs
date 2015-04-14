using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Mvc;
using CreepScoreAPI.Constants;
using UrfStg.Model;

namespace UrfStg.Web.Controllers
{
    /// <summary>
    /// Contains routes for accessing game data.
    /// </summary>
    public class GamesController : JsonNetController
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
        /// Gets a game by id.
        /// </summary>
        /// <returns>A <see cref="Match"/>.</returns>
        public ActionResult Index(long id)
        {
            var match = GetMatch(id);

            HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            HttpContext.Response.AddHeader("Vary", "Origin");
            return JsonNet(match, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets a random game.
        /// </summary>
        /// <returns>A <see cref="Match"/>.</returns>
        public ActionResult Random()
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
            var match = GetMatch(selectedId);

            HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            HttpContext.Response.AddHeader("Vary", "Origin");
            return JsonNet(match, JsonRequestBehavior.AllowGet);
        }

        private Match GetMatch(long id)
        {
            var match = dataContext.Matches
                .Include(m => m.Participants)
                .Include(m => m.Teams.Select(t => t.Bans))
                .FirstOrDefault(m => m.Id == id);

            // The client is only interested in champion kill events.
            var query =
                from e in dataContext.Events.Include(e => e.AssistingParticipants)
                where e.MatchId == id && e.EventType == AdvancedMatchHistoryConstants.EventTypeAdvanced.ChampionKill
                orderby e.Timestamp
                select e;
            match.Events = query.ToList();
            // Important: do NOT save changes at this point.
            return match;
        }
    }
}
