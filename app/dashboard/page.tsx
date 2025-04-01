// app/dashboard/page.tsx
"use client";
import { useQuery } from "@apollo/client";
import { GET_MY_TASKS } from "@/app/graphql/queries";
import TaskForm from "@/app/components/TaskForm";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/app/graphql/mutations";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  
}

export default function Dashboard() {
  const { data, loading, error } = useQuery<{ myTasks: Task[] }>(GET_MY_TASKS);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const router = useRouter();
  const [logout] = useMutation(LOGOUT_MUTATION);

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  const tasks = data?.myTasks || [];
  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
  const pendingCount = tasks.filter(t => t.status === "PENDING").length;
  const inProgressCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const activeTasks = tasks.filter(t => t.status !== "COMPLETED");

  const handleLogout = async () => {
    try {
      await logout();

      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Task Dashboard</h1>
          <p className="text-blue-600">You have {activeTasks.length} active tasks</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            count={pendingCount}
            label="Pending"
            color="bg-amber-100 text-amber-800"
          />
          <StatCard 
            count={inProgressCount}
            label="In Progress"
            color="bg-blue-100 text-blue-800"
          />
          <StatCard 
            count={completedCount}
            label="Completed"
            color="bg-green-100 text-green-800"
          />
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {showCompleted ? "All Tasks" : "Active Tasks"}
            </h2>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showCompleted ? "Hide Completed" : `Show Completed (${completedCount})`}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 group"
            >
              <span>Logout</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7" 
                />
              </svg>
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Create your first task!
            </div>
          ) : (
            <div className="space-y-4">
              {(showCompleted ? tasks : activeTasks).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowTaskForm(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          New Task
        </button>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <TaskForm 
                onClose={() => setShowTaskForm(false)} 
                onSuccess={() => {
                  setShowTaskForm(false);
                  // Consider using Apollo cache updates instead of reload
                  window.location.reload();
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className={`rounded-lg p-6 ${color.split(' ')[0]}`}>
      <div className="text-3xl font-bold">{count}</div>
      <div className={`text-sm font-medium ${color.split(' ')[1]}`}>{label}</div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task }: { task: Task }) {
  const statusStyles = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200"
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${statusStyles[task.status]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-sm mt-1 text-gray-600">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[task.status]}`}>
            {task.status.replace("_", " ")}
          </span>
          
        </div>
      </div>
    </div>
  );
}