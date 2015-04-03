using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataGatherer
{
    public static class TaskExtensions
    {
        /// <summary>
        /// Starts and forgets a task. This is useful for supressing warning methods for tasks where you want to ignore the result.
        /// </summary>
        /// <param name="task"></param>
        public static void Forget(this Task task)
        { }
    }
}
