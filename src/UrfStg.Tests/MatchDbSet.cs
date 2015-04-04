using System;
using System.Collections.Generic;
using System.Linq;
using FakeDbSet;
using UrfStg.Model;

namespace UrfStg.Tests
{
    public class MatchDbSet : InMemoryDbSet<Match>
    {
        public override Match Find(params object[] keyValues)
        {
            if (keyValues == null)
                throw new ArgumentNullException("keyValues");
            if (keyValues.Length != 1)
                throw new ArgumentException("Incorrect number of keys (expected 1 but was " + keyValues.Length + ").");

            var id = (long)keyValues[0];
            return this.FirstOrDefault(m => m.Id == id);
        }
    }
}
