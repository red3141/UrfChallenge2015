﻿using System.Data.Entity;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public interface IRiotDataContext
    {
        IDbSet<Match> Matches { get; set; }

        IDbSet<ParticipantIdentity> ParticipantIdentities { get; set; }

        IDbSet<Participant> Participants { get; set; }

        IDbSet<Team> Teams { get; set; }

        IDbSet<BannedChampion> BannedChampions { get; set; }

        IDbSet<Event> Events { get; set; }

        int SaveChanges();
    }
}
