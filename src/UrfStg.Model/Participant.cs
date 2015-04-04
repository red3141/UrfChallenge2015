using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public class Participant
    {
        /// <summary>
        /// Gets or sets the ID of the participant within the current match.
        /// </summary>
        [Key, Column("id", Order = 0)]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the ID of the match in which the participant played.
        /// </summary>
        [Key, Column("matchId", Order = 1)]
        public long MatchId { get; set; }

        public int ChampionId { get; set; }
        public int Spell1Id { get; set; }
        public int Spell2Id { get; set; }
        public int TeamId { get; set; }

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
