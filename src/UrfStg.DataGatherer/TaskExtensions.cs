using System.Threading.Tasks;

namespace UrfStg.DataGatherer
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
