using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using CreepScoreAPI;
using UrfStg.Model;

namespace UrfStg.DataGatherer
{
    /// <summary>
    /// Handles downloading of game data at regular intervals.
    /// </summary>
    public class DataManager : IDataManager
    {
        private static readonly TimeSpan downloadInterval = TimeSpan.FromMinutes(10);

        private readonly Timer timer;
        private readonly CreepScore lolClient;
        private readonly IRiotDataContext dataContext;

        private CreepScore.Region region;

        public DataManager()
            : this(new RiotDataContext())
        { }

        public DataManager(IRiotDataContext dataContext)
        {
            if (dataContext == null)
                throw new ArgumentNullException("dataContext");

            timer = new Timer(downloadInterval.TotalMilliseconds);
            timer.Elapsed += timer_Elapsed;

            this.dataContext = dataContext;
            lolClient = new CreepScore(ConfigurationManager.AppSettings["RiotApiKey"]);
            region = CreepScore.Region.NA;
        }

        /// <summary>
        /// Starts downloading data at a regular interval.
        /// </summary>
        public Task Start()
        {
            timer.Start();
            return DownloadLatestGames();
        }

        /// <summary>
        /// Downloads the latest games available on the API.
        /// </summary>
        public async Task DownloadLatestGames()
        {
            try
            {
                // Use a start date of 2 hours ago. Hopefully all games that started then are over by now.
                var nearest5Minutes = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day,
                    DateTime.UtcNow.Hour, (DateTime.UtcNow.Minute / 5) * 5, 0, DateTimeKind.Utc);
                var beginDate = new DateTimeOffset(nearest5Minutes - TimeSpan.FromHours(2), TimeSpan.Zero);
                var matchIds = await lolClient.RetrieveUrfIds(region, beginDate);
                if (matchIds == null)
                {
                    Console.WriteLine("Failed to get match IDs.");
                    return;
                }
                foreach (var matchId in matchIds)
                {
                    if (dataContext.Matches.Any(m => m.Id == matchId))
                        continue;
                    var matchDetail = await lolClient.RetrieveMatch(region, matchId, true);
                    if (matchDetail == null)
                        continue;
                    var match = new Match(matchDetail);
                    if (match.Events == null || match.Events.Count == 0)
                        continue;
                    dataContext.Matches.Add(match);
                    dataContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to get match IDs: " + ex);
            }
        }

        private void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            DownloadLatestGames().Forget();
        }
    }
}
