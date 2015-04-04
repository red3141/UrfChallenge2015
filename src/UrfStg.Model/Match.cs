using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CreepScoreAPI;
using CreepScoreAPI.Constants;

namespace UrfStg.Model
{
    public class Match
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Id { get; set; }
        public long MapId { get; set; }
        public long MatchCreation { get; set; }
        public long MatchDuration { get; set; }
        public GameConstants.GameMode MatchMode { get; set; }
        public GameConstants.GameType MatchType { get; set; }
        public string MatchVersion { get; set; }
        public IList<Participant> Participants { get; set; }
        public AdvancedMatchHistoryConstants.QueueTypeAdvanced QueueType { get; set; }
        public string Region { get; set; }
        public AdvancedMatchHistoryConstants.SeasonAdvanced Season { get; set; }
        public IList<Team> Teams { get; set; }
        public IList<Event> Events { get; set; }

        public Match() 
        {
            Participants = new List<Participant>();
            Teams = new List<Team>();
            Events = new List<Event>();
        }

        public Match(MatchDetailAdvanced matchDetail)
        {
            Id = matchDetail.matchId;
            MapId = matchDetail.mapId;
            MatchCreation = matchDetail.matchCreation;
            MatchDuration = matchDetail.matchDuration;
            MatchMode = matchDetail.matchMode;
            MatchType = matchDetail.matchType;
            MatchVersion = matchDetail.matchVersion;
            QueueType = matchDetail.queueType;
            Region = matchDetail.region;
            Season = matchDetail.season;

            Participants = matchDetail.participants != null
                ? matchDetail.participants.Select(p => new Participant(p, Id)).ToList()
                : new List<Participant>();
            Teams = matchDetail.teams != null
                ? matchDetail.teams.Select(t => new Team(t, Id)).ToList()
                : new List<Team>();
            Events = matchDetail.timeline != null && matchDetail.timeline.frames != null
                ? matchDetail.timeline.frames.Where(f => f.events != null).SelectMany(f => f.events.Select(e => new Event(e, Id, Participants))).ToList()
                : new List<Event>();
        }
    }
}
