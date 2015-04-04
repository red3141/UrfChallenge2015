using System.Data.Entity;
using System.Text.RegularExpressions;
using CreepScoreAPI;

namespace UrfStg.Model
{
    public class RiotDataContext : DbContext, IRiotDataContext
    {
        public RiotDataContext()
            : base("UrfDb")
        { }

        public IDbSet<Match> Matches { get; set; }

        public IDbSet<Participant> Participants { get; set; }

        public IDbSet<Team> Teams { get; set; }

        public IDbSet<BannedChampion> BannedChampions { get; set; }

        public IDbSet<Event> Events { get; set; }

        public IDbSet<Champion> Champions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Types().Configure(c => c.ToTable(GetDbTableName(c.ClrType.Name)));
            modelBuilder.Properties().Configure(c => c.HasColumnName(GetDbColumnName(c.ClrPropertyInfo.Name)));

            modelBuilder.Entity<Event>()
                .HasMany(e => e.AssistingParticipants)
                .WithMany()
                .Map(mc => mc
                    .MapLeftKey("eventId")
                    .MapRightKey("participantId", "matchId")
                    .ToTable("assist"));

            base.OnModelCreating(modelBuilder);
        }

        private static string GetDbTableName(string clrName)
        {
            // Add an underscore before each capital letter (but not before the first letter) to get the object name.
            var result = Regex.Replace(clrName, ".[A-Z]", m => m.Value[0] + "_" + m.Value[1]).ToLowerInvariant();
            // Table names in MySql are all lower case.
            return result;
        }

        private static string GetDbColumnName(string clrName)
        {
            if (string.IsNullOrEmpty(clrName))
                return clrName;
            // Convert the first letter to lower case
            var result = char.ToLowerInvariant(clrName[0]) + clrName.Substring(1);
            return result;
        }

    }
}
