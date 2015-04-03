using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CreepScoreAPI.Constants;

namespace DataGatherer.Models
{
    public class Event
    {
        public List<int> AssistingParticipantIds { get; set; }

        /// <summary>
        /// Gets or sets the ID of the participant who killed the target (if appliccable). A killer ID of 0 indicates a minion.
        /// </summary>
        public int? KillerId { get; set; }

        public AdvancedMatchHistoryConstants.BuildingTypeAdvanced BuildingType { get; set; }

        /// <summary>
        /// Gets or sets the ID of the participant who created the target (if appliccable).
        /// </summary>
        public int? CreatorId { get; set; }

        public AdvancedMatchHistoryConstants.EventTypeAdvanced EventType { get; set; }
        public int? ItemAfter { get; set; }
        public int? ItemBefore { get; set; }
        public int? ItemId { get; set; }
        public AdvancedMatchHistoryConstants.LaneTypeAdvanced LaneType { get; set; }
        public AdvancedMatchHistoryConstants.LevelUpTypeAdvanced LevelUpType { get; set; }
        public AdvancedMatchHistoryConstants.MonsterTypeAdvanced MonsterType { get; set; }

        /// <summary>
        /// Gets or sets the participant ID of the event. Only present if relevant.
        /// </summary>
        public int? ParticipantId { get; set; }

        public AdvancedMatchHistoryConstants.PointCapturedAdvanced PointCaptured { get; set; }

        /// <summary>
        /// Gets or sets the x-position where the event occurred.
        /// </summary>
        public int X { get; set; }

        /// <summary>
        /// Gets or sets the y-position where the event occurred.
        /// </summary>
        public int Y { get; set; }

        /// <summary>
        /// Gets or sets te index of the champion ability that caused the event.
        /// </summary>
        public int? SkillSlot { get; set; }
        public int? TeamId { get; set; }

        /// <summary>
        /// Gets or sets the game time when the event occurred.
        /// </summary>
        public TimeSpan Timestamp { get; set; }

        public AdvancedMatchHistoryConstants.TowerTypeAdvanced TowerType { get; set; }

        /// <summary>
        /// Gets or sets the ID of the participant who was the victim (i.e. who died), if appliccable.
        /// </summary>
        public int? VictimId { get; set; }

        public AdvancedMatchHistoryConstants.WardTypeAdvanced WardType { get; set; }

        public int MatchId { get; set; }
    }
}
