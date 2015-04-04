using System;
using System.Collections.Generic;
using System.Linq;
using FakeDbSet;
using Moq;
using NUnit.Framework;
using UrfStg.Model;
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
            var mockDb = Mock.Of<IRiotDataContext>(d => d.Matches == new MatchDbSet { new Match { Id = 12L } });
            var controller = new GamesController(mockDb);

            var match = controller.GetRandomGame();

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
            var mockDb = Mock.Of<IRiotDataContext>(d => d.Matches == matches);
            var controller = new GamesController(mockDb);

            var match = controller.GetRandomGame();

            Assert.That(match, Is.Not.Null);
            Assert.That(matches.Any(m => m.Id == match.Id), "Invalid match ID.");
        }

        [Test]
        public void ShouldHaveEvenDistribution()
        {
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
            };
            var numIterations = 1000;
            var counts = new int[matches.Count()];

            for (var i = 0; i < numIterations; ++i)
            {
                var mockDb = Mock.Of<IRiotDataContext>(d => d.Matches == matches);
                var controller = new GamesController(mockDb);

                var match = controller.GetRandomGame();

                var index = IndexOf(matches, match);
                Assert.That(index, Is.AtLeast(0));
                ++counts[index];
            }

            var expected = (double)numIterations / counts.Length;
            var tolerance = 0.1;
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
