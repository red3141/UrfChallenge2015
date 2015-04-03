using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public class Team
    {
        [Key]
        public int Id { get; set; }
        public IList<BannedChampion> Bans { get; set; }
        public int BaronKills { get; set; }
        public int DragonKills { get; set; }
        public bool FirstBaron { get; set; }
        public bool FirstBlood { get; set; }
        public bool FirstDragon { get; set; }
        public bool FirstInhibitor { get; set; }
        public bool FirstTower { get; set; }
        public int InhibitorKills { get; set; }
        public int TowerKills { get; set; }
        public int VilemawKills { get; set; }
        public bool Winner { get; set; }

        public long MatchId { get; set; }

        public Team()
        { }

        public Team(TeamAdvanced team, long matchId)
        {
            MatchId = matchId;
            if (team == null)
                return;
            Id = team.teamId;
            if (team.bans != null)
                Bans = team.bans.Select(b => new BannedChampion(b)).ToList();
            BaronKills = team.baronKills;
            DragonKills = team.dragonKills;
            FirstBaron = team.firstBaron;
            FirstBlood = team.firstBlood;
            FirstDragon = team.firstDragon;
            FirstInhibitor = team.firstInhibitor;
            FirstTower = team.firstTower;
            InhibitorKills = team.inhibitorKills;
            TowerKills = team.towerKills;
            VilemawKills = team.vilemawKills;
            Winner = team.winner;
        }
    }
}
