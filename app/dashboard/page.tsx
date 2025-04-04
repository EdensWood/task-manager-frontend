// app/dashboard/page.tsx
"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_TASKS } from "@/app/graphql/queries";
import {DELETE_TASK_MUTATION } from "@/app/graphql/mutations";
import TaskForm from "@/app/components/TaskForm";
import TaskList from "@/app/components/TaskList";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Task } from "@/app/types/task";

export default function Dashboard() {
  // Data fetching
  // In dashboard.tsx
const { data, loading, error } = useQuery<{ myTasks: Task[] }>(GET_MY_TASKS, {
  fetchPolicy: "network-only",
  context: {
    headers: {
      "credentials": "include"
    }
  },
  onError: (err) => {
    console.error("Detailed error:", err);
    if (err.message.includes("Unauthorized")) {
      // Handle session expiration
      window.location.href = "/login";
    }
  }
});
  
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Fetched tasks:", data?.myTasks);
  
  
  
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    refetchQueries: [{ query: GET_MY_TASKS }],
  });

  // State management
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Derived data
  const tasks = data?.myTasks || [];
  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
  const pendingCount = tasks.filter(t => t.status === "PENDING").length;
  const inProgressCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const activeTasks = tasks.filter(t => t.status !== "COMPLETED");

  // Handlers
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id } });
    }
  };

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Task Dashboard</h1>
          <p className="text-blue-600">You have {activeTasks.length} active tasks</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard count={pendingCount} label="Pending" color="bg-amber-100 text-amber-800" />
          <StatCard count={inProgressCount} label="In Progress" color="bg-blue-100 text-blue-800" />
          <StatCard count={completedCount} label="Completed" color="bg-green-100 text-green-800" />
        </div>

        {/* Task List Section */}
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
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Create your first task!
            </div>
          ) : (
            <TaskList 
              tasks={showCompleted ? tasks : activeTasks} 
              onEdit={setSelectedTask}
              onDelete={handleDelete}
            />
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

        {/* Task Form Modals */}
        {showTaskForm && (
          <TaskFormModal onClose={() => setShowTaskForm(false)} />
        )}

        {selectedTask && (
          <TaskFormModal 
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className={`rounded-lg p-6 ${color.split(' ')[0]}`}>
      <div className="text-3xl font-bold">{count}</div>
      <div className={`text-sm font-medium ${color.split(' ')[1]}`}>{label}</div>
    </div>
  );
}

function TaskFormModal({ task, onClose }: { task?: Task; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <TaskForm 
          task={task}
          onClose={onClose}
          onSuccess={() => {
            onClose();
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}