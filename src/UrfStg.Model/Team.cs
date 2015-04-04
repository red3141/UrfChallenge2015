using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public class Team
    {
        /// <summary>
        /// Gets or sets a unique identifier for this record.
        /// </summary>
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets the team ID (100 = blue team; 200 = red team).
        /// </summary>
        public int TeamId { get; set; }

        /// <summary>
        /// Gets or sets the ID of the match in which the team played.
        /// </summary>
        public long MatchId { get; set; }

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

        public Team()
        {
            Bans = new List<BannedChampion>();
        }

        public Team(TeamAdvanced team, long matchId)
        {
            MatchId = matchId;
            if (team == null)
                return;
            TeamId = team.teamId;
            Bans = team.bans != null
                ? team.bans.Select(b => new BannedChampion(b, MatchId, this)).ToList()
                : new List<BannedChampion>();
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
