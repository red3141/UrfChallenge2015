using System.Data.Entity;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public interface IRiotDataContext
    {
        IDbSet<MatchDetailAdvanced> Matches { get; set; }

        IDbSet<ParticipantIdentity> ParticipantIdentities { get; set; }

        IDbSet<Participant> Participants { get; set; }

        IDbSet<Team> Teams { get; set; }

        IDbSet<FrameAdvanced> Frames { get; set; }

        IDbSet<BannedChampion> BannedChampions { get; set; }

        IDbSet<EventAdvanced> Events { get; set; }
    }
}
