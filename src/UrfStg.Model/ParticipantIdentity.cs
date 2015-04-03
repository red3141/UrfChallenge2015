using System.ComponentModel.DataAnnotations;

namespace UrfStg.Model
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
