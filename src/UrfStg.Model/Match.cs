using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CreepScoreAPI.Constants;

namespace UrfStg.Model
{
    public class Match
    {
        [Key]
        public long Id { get; set; }
        public long MapId { get; set; }
        public long MatchCreation { get; set; }
        public long MatchDuration { get; set; }
        public GameConstants.GameMode MatchMode { get; set; }
        public GameConstants.GameType MatchType { get; set; }
        public string MatchVersion { get; set; }
        public List<ParticipantIdentity> ParticipantIdentities { get; set; }
        public List<Participant> Participants { get; set; }
        public AdvancedMatchHistoryConstants.QueueTypeAdvanced QueueType { get; set; }
        public string Region { get; set; }
        public AdvancedMatchHistoryConstants.SeasonAdvanced Season { get; set; }
        public List<Team> Teams { get; set; }
        public List<Event> Events { get; set; }
    }
}
