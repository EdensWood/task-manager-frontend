"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_TASKS } from "@/app/graphql/queries";
import { DELETE_TASK_MUTATION, LOGOUT_MUTATION } from "@/app/graphql/mutations";
import TaskForm from "@/app/components/TaskForm";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Task } from "@/app/types/task";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery<{ myTasks: Task[] }>(GET_MY_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [logout] = useMutation(LOGOUT_MUTATION);
  const router = useRouter();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks = data?.myTasks || [];

  const groupedTasks = {
    PENDING: tasks.filter(t => t.status === "PENDING"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    COMPLETED: tasks.filter(t => t.status === "COMPLETED"),
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({ variables: { id } });
      await refetch();
      toast.success("Task deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete task");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout error", err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Dashboard</h1>
            <p className="text-gray-600">{tasks.length} total task{tasks.length !== 1 && "s"}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
            >
              <FaPlus /> New Task
            </button>
          </div>
        </div>

        {/* Kanban-style Columns */}
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
          {["PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
            <div key={status} className="flex-1 min-w-[250px] bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                {status.replace("_", " ")}
              </h2>
              <div className="space-y-4">
                {groupedTasks[status as keyof typeof groupedTasks].map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-100 p-3 rounded-md shadow-sm hover:bg-gray-200 transition"
                  >
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Task Form Modals */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <TaskForm 
                onClose={() => setShowTaskForm(false)}
                onSuccess={() => {
                  setShowTaskForm(false);
                  refetch();
                }}
              />
            </div>
          </div>
        )}

        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <TaskForm 
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onSuccess={() => {
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
