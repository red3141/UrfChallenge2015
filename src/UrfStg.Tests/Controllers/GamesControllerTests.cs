using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FakeDbSet;
using Moq;
using NUnit.Framework;
using UrfStg.Model;
using UrfStg.Web;
using UrfStg.Web.Controllers;
using Match = UrfStg.Model.Match;

namespace UrfStg.Tests.Controllers
{
    [TestFixture]
    public class GamesControllerTests
    {
        [Test]
        public void ShouldGetGame()
        {
            var mockDb = Mock.Of<IRiotDataContext>(d =>
                d.Matches == new MatchDbSet { new Match { Id = 12L } } &&
                d.Events == new InMemoryDbSet<Event>());
            var controller = new GamesController(mockDb);

            var match = (Match)((JsonNetResult)controller.Random()).Data;

            Assert.That(match, Is.Not.Null);
            Assert.That(match.Id, Is.EqualTo(12L));
        }

        [Test]
        public void ShouldGetRandomGame()
        {
            var matches = new MatchDbSet
            {
                new Match { Id = 134L },
                new Match { Id = 14L },
                new Match { Id = 2436474L },
                new Match { Id = 2436475L },
                new Match { Id = 95344L },
            };
            var mockDb = Mock.Of<IRiotDataContext>(d =>
                d.Matches == matches &&
                d.Events == new InMemoryDbSet<Event>());
            var controller = new GamesController(mockDb);

            var match = (Match)((JsonNetResult)controller.Random()).Data;

            Assert.That(match, Is.Not.Null);
            Assert.That(matches.Any(m => m.Id == match.Id), "Invalid match ID.");
        }

        [Test]
        public void ShouldGetSpecificGame()
        {
            var matches = new MatchDbSet
            {
                new Match { Id = 134L },
                new Match { Id = 14L },
                new Match { Id = 2436474L },
                new Match { Id = 2436475L },
                new Match { Id = 95344L },
            };
            var mockDb = Mock.Of<IRiotDataContext>(d =>
                d.Matches == matches &&
                d.Events == new InMemoryDbSet<Event>());
            var controller = new GamesController(mockDb);

            var match = (Match)((JsonNetResult)controller.Index(14L)).Data;

            Assert.That(match, Is.Not.Null);
            Assert.That(match.Id, Is.EqualTo(14L));
        }

        [Test]
        public void ShouldHaveEvenDistribution()
        {
            // Note that this test may fail intermittently due to the random nature of GetRandomGame().
            // As long as this test passes most of the time, it's fine.
            var matches = new MatchDbSet
            {
                new Match { Id = 134L },
                new Match { Id = 14L },
                new Match { Id = 2436474L },
                new Match { Id = 2436475L },
                new Match { Id = 95344L },
                new Match { Id = 11L },
                new Match { Id = 98665457465L },
                new Match { Id = 98665457466L },
                new Match { Id = 98665457467L },
            };
            var numIterations = 1000;
            var counts = new int[matches.Count()];

            for (var i = 0; i < 1000; ++i)
            {
                var mockDb = Mock.Of<IRiotDataContext>(d =>
                    d.Matches == matches &&
                    d.Events == new InMemoryDbSet<Event>());
                var controller = new GamesController(mockDb);

                var match = (Match)((JsonNetResult)controller.Random()).Data;

                var index = IndexOf(matches, match);
                Assert.That(index, Is.AtLeast(0));
                ++counts[index];
            }

            var expected = (double)numIterations / counts.Length;
            var tolerance = 0.15;
            var min = Convert.ToInt32(expected * (1 - tolerance));
            var max = Convert.ToInt32(expected * (1 + tolerance));
            foreach (var count in counts)
            {
                Assert.That(count, Is.AtLeast(min));
                Assert.That(count, Is.AtMost(max));
            }
        }

        private static int IndexOf<T>(IEnumerable<T> list, T item)
        {
            var index = 0;
            foreach(var listItem in list)
            {
                if (Equals(listItem, item))
                    return index;
                ++index;
            }
            return -1;
        }
    }
}
