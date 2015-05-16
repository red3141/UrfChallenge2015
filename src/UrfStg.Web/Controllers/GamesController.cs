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
        private readonly IRiotDataContext dataContext;

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
        /// Gets a game by id.
        /// </summary>
        /// <returns>A <see cref="Match"/>.</returns>
        public ActionResult Index(long id)
        {
            var match = GetMatch(id);
            if (match == null)
                return HttpNotFound();

            if (HttpContext != null)
            {
                HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
                HttpContext.Response.AddHeader("Vary", "Origin");
            }
            return JsonNet(match, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets a random game.
        /// </summary>
        /// <returns>A <see cref="Match"/>.</returns>
        public ActionResult Random()
        {
            var ids = dataContext.Matches.Select(m => m.Id).ToList();
            var random = new Random();
            var index = random.Next(ids.Count);
            var selectedId = ids[index];
            var match = GetMatch(selectedId);

            if (HttpContext != null)
            {
                HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
                HttpContext.Response.AddHeader("Vary", "Origin");
            }
            return JsonNet(match, JsonRequestBehavior.AllowGet);
        }

        private Match GetMatch(long id)
        {
            var match = dataContext.Matches
                .Include(m => m.Participants)
                .Include(m => m.Teams.Select(t => t.Bans))
                .FirstOrDefault(m => m.Id == id);
            if (match == null)
                return null;

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
