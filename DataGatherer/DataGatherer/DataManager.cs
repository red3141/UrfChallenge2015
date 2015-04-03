using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using CreepScoreAPI;

namespace DataGatherer
{
    public class DataManager : IDataManager
    {
        private static readonly TimeSpan downloadInterval = TimeSpan.FromMinutes(10);

        private readonly Timer timer;
        private readonly CreepScore lolClient;

        private CreepScore.Region region;

        public DataManager()
        {
            timer = new Timer(downloadInterval.TotalMilliseconds);
            timer.Elapsed += timer_Elapsed;

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
            // Use a start date of 1.5 hours ago. Hopefully all games that started then are over by now.
            var beginDate = new DateTimeOffset(DateTime.UtcNow, TimeSpan.Zero);
            var matchIds = await lolClient.RetrieveUrfIds(region, beginDate);
            foreach (var matchId in matchIds)
            {
                var match = await lolClient.RetrieveMatch(region, matchId, true);
            }
        }

        private void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            DownloadLatestGames().Forget();
        }
    }
}
