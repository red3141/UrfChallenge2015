using System.ComponentModel.DataAnnotations;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public class Participant
    {
        [Key]
        public int Id { get; set; }
        public int ChampionId { get; set; }
        public int Spell1Id { get; set; }
        public int Spell2Id { get; set; }
        public int TeamId { get; set; }

        public long MatchId { get; set; }

        public Participant()
        { }

        public Participant(ParticipantAdvanced p, long matchId)
        {
            MatchId = matchId;
            if (p == null)
                return;
            Id = p.participantId;
            ChampionId = p.championId;
            Spell1Id = p.spell1Id;
            Spell2Id = p.spell2Id;
            TeamId = p.teamId;
        }
    }
}
