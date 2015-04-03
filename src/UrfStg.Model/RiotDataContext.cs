using System.Data.Entity;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public class RiotDataContext : DbContext, IRiotDataContext
    {
        public IDbSet<MatchDetailAdvanced> Matches { get; set; }

        public IDbSet<ParticipantIdentity> ParticipantIdentities { get; set; }

        public IDbSet<Participant> Participants { get; set; }

        public IDbSet<Team> Teams { get; set; }

        public IDbSet<FrameAdvanced> Frames { get; set; }

        public IDbSet<BannedChampion> BannedChampions { get; set; }

        public IDbSet<EventAdvanced> Events { get; set; }
    }
}
