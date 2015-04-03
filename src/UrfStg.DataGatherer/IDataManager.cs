using System.Threading.Tasks;

namespace UrfStg.DataGatherer
{
    interface IDataManager
    {
        /// <summary>
        /// Starts downloading data at a regular interval.
        /// </summary>
        Task Start();

        /// <summary>
        /// Downloads the latest games available on the API.
        /// </summary>
        Task DownloadLatestGames();
    }
}
