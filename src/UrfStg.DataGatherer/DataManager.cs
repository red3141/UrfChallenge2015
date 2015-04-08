using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using CreepScoreAPI;
using CreepScoreAPI.Constants;
using UrfStg.Model;
using Champion = UrfStg.Model.Champion;

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
            var apiKey = ConfigurationManager.AppSettings["RiotApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                Console.WriteLine("No Riot API key found. Please specify a RiotApiKey in the appSettings section in App.config.");
            lolClient = new CreepScore(apiKey);
            region = CreepScore.Region.NA;
        }

        /// <summary>
        /// Starts downloading data at a regular interval.
        /// </summary>
        public async Task Start()
        {
            // TODO: also update champion list, although we don't need to worry about that until a new champion comes out. 
            if (!dataContext.Champions.Any())
            {
                Console.WriteLine("Downloading champion data...");
                var champs = await lolClient.RetrieveChampionsData(region, StaticDataConstants.ChampData.Image);
                Console.WriteLine("Saving champion data...");
                foreach (var champ in champs.data.Values)
                    dataContext.Champions.Add(new Champion(champ));
                dataContext.SaveChanges();
                Console.WriteLine("Finished saving champion data.");
            }
            Console.WriteLine("Starting to download games...");
            //timer.Start();
            await DownloadLatestGames();
        }

        /// <summary>
        /// Downloads the latest games available on the API.
        /// </summary>
        public async Task DownloadLatestGames()
        {
            int gameCount = 0;
            while (gameCount < 500)
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
                    if (matchIds.Count == 0)
                    {
                        Console.WriteLine("Got 0 match IDs.");
                        return;
                    }
                    int current = 1;
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
                        Console.WriteLine("Saved game {0}/{1}: {2}", current, matchIds.Count, matchId);
                        ++current;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to get match IDs: " + ex);
                }
                await Task.Delay(60000);
            }
        }

        private void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            DownloadLatestGames().Forget();
        }
    }
}
