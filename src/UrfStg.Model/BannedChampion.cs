using CreepScoreAPI;

namespace UrfStg.Model
{
    public class BannedChampion
    {
        public int ChampionId { get; set; }
        public int PickTurn { get; set; }
        public int? TeamId { get; set; }

        public BannedChampion()
        { }

        public BannedChampion(BannedChampionAdvanced bc)
        {
            ChampionId = bc.championId;
            PickTurn = bc.pickTurn;
            TeamId = bc.teamId;
        }
    }
}
