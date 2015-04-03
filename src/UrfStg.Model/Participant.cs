using System.ComponentModel.DataAnnotations;

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

        public int MatchId { get; set; }
    }
}
