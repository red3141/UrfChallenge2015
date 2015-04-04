using System.ComponentModel.DataAnnotations;
using CreepScoreAPI;

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

        public long MatchId { get; set; }

        public ParticipantIdentity()
        { }

        public ParticipantIdentity(ParticipantIdentityAdvanced p, long matchId)
        {
            MatchId = matchId;
            if (p == null)
                return;
            Id = p.participantId;
            if (p.player == null)
                return;
            MatchHistoryUri = p.player.matchHistoryUri;
            ProfileIcon = p.player.profileIcon;
            SummonerId = p.player.summonerId;
            SummonerName = p.player.summonerName;
        }
    }
}
