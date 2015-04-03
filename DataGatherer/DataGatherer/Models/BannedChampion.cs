using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataGatherer.Models
{
    public class BannedChampion
    {
        public int ChampionId { get; set; }
        public int PickTurn { get; set; }
        public int? TeamId { get; set; }
    }
}
