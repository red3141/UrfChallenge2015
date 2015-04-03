using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataGatherer.Models
{
    public class ParticipantIdentity
    {
        [Key]
        public int Id { get; set; }
        public string MatchHistoryUri { get; set; }
        public int ProfileIcon { get; set; }
        public long SummonerId { get; set; }
        public string SummonerName { get; set; }

        public int MatchId { get; set; }
    }
}
