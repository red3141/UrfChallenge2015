using System;

namespace UrfStg.DataGatherer
{
    /// <summary>
    /// Gathers data for URF games.
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            var dataManager = new DataManager();
            dataManager.Start().Forget();
            Console.WriteLine("Data Gatherer started.");
            Console.WriteLine("Press enter to exit.");
            Console.ReadLine();
        }
    }
}
