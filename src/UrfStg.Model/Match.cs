using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using CreepScoreAPI;
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
        public IList<ParticipantIdentity> ParticipantIdentities { get; set; }
        public IList<Participant> Participants { get; set; }
        public AdvancedMatchHistoryConstants.QueueTypeAdvanced QueueType { get; set; }
        public string Region { get; set; }
        public AdvancedMatchHistoryConstants.SeasonAdvanced Season { get; set; }
        public IList<Team> Teams { get; set; }
        public IList<Event> Events { get; set; }

        public Match() 
        {
            ParticipantIdentities = new List<ParticipantIdentity>();
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

            ParticipantIdentities = matchDetail.participantIdentities.Select(p => new ParticipantIdentity(p, Id)).ToList();
            Participants = matchDetail.participants.Select(p => new Participant(p, Id)).ToList();
            Teams = matchDetail.teams.Select(t => new Team(t, Id)).ToList();
            Events = matchDetail.timeline.frames.SelectMany(f => f.events.Select(e => new Event(e, Id))).ToList();
        }
    }
}
