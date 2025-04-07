"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_TASKS } from "@/app/graphql/queries";
import { DELETE_TASK_MUTATION, LOGOUT_MUTATION } from "@/app/graphql/mutations";
import TaskForm from "@/app/components/TaskForm";
import TaskList from "@/app/components/TaskList";
import { useState } from "react";
import { FaPlus, FaSignOutAlt, FaFilter } from "react-icons/fa";
import { Task } from "@/app/types/task";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Galada } from 'next/font/google';

// Load Galada font
const galada = Galada({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery<{ myTasks: Task[] }>(GET_MY_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [logout] = useMutation(LOGOUT_MUTATION);
  const router = useRouter();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks = data?.myTasks || [];
  const filteredTasks = showCompleted ? tasks : tasks.filter(t => t.status !== "COMPLETED");
  const activeTaskCount = tasks.filter(t => t.status !== "COMPLETED").length;

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({
        variables: { id },
      });
      await refetch();
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Delete error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/sign-in");
      router.refresh();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Centered Taskify Title */}
      <div className="text-center mb-6">
        <h1 className={`${galada.className} text-5xl md:text-6xl text-blue-600 mb-2`}>Taskify</h1>
        <p className="text-gray-500 text-lg">Your personal task manager</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">My Tasks</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {activeTaskCount} {activeTaskCount === 1 ? 'active task' : 'active tasks'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Filter Button */}
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 bg-white p-2 sm:px-4 sm:py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
              aria-label={showCompleted ? 'Hide completed' : 'Show completed'}
            >
              <FaFilter className="text-gray-500" />
              <span className="hidden sm:inline">
                {showCompleted ? 'Hide Completed' : 'Show Completed'}
              </span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <FaPlus className="flex-shrink-0" />
              <span className="truncate">Add Task</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="md:hidden text-gray-700 hover:text-red-600 transition-colors p-2 ml-1 sm:ml-2 flex-shrink-0"
              title="Logout"
              aria-label="Logout"
            >
              <FaSignOutAlt />
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <FaSignOutAlt />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Task List Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <TaskList 
            tasks={filteredTasks}
            onEdit={setSelectedTask}
            onDelete={handleDelete}
          />

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
              <p className="text-gray-500 mt-1">Get started by creating a new task</p>
              <button
                onClick={() => setShowTaskForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <FaPlus /> Create Task
              </button>
            </div>
          )}
        </div>

        {/* Task Form Modals */}
        {(showTaskForm || selectedTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
              <TaskForm 
                task={selectedTask || undefined}
                onClose={() => {
                  setShowTaskForm(false);
                  setSelectedTask(null);
                }}
                onSuccess={() => {
                  setShowTaskForm(false);
                  setSelectedTask(null);
                  refetch();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}