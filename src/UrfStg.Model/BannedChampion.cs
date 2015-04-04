using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Xml.Serialization;
using CreepScoreAPI;
using Newtonsoft.Json;

namespace UrfStg.Model
{
    public class BannedChampion
    {
        /// <summary>
        /// Gets or sets a unique identifier for this record.
        /// </summary>
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets the turn at which this champion was banned, starting with 1.
        /// </summary>
        public int PickTurn { get; set; }

        /// <summary>
        /// Gets or sets the ID of the champion that was banned.
        /// </summary>
        public int ChampionId { get; set; }

        /// <summary>
        /// Gets or sets the ID of the team that banned the champion (100 = blue; 200 = red).
        /// </summary>
        public int? TeamId { get; set; }

        /// <summary>
        /// Gets or sets the record ID of the team that banned the champion.
        /// </summary>
        public long? TeamRecordId { get; set; }

        /// <summary>
        /// Gets or sets the team that banned the champion.
        /// </summary>
        [ForeignKey("TeamRecordId")]
        [JsonIgnore, XmlIgnore]
        public Team Team { get; set; }

        public long MatchId { get; set; }

        public BannedChampion()
        { }

        public BannedChampion(BannedChampionAdvanced bc, long matchId, Team team)
        {
            MatchId = matchId;
            if (bc == null)
                return;
            ChampionId = bc.championId;
            PickTurn = bc.pickTurn;
            TeamId = bc.teamId;
            Team = team;
            if (team != null)
                TeamRecordId = team.Id;
        }
    }
}
