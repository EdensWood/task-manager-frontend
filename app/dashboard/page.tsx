"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_TASKS } from "@/app/graphql/queries";
import { DELETE_TASK_MUTATION } from "@/app/graphql/mutations";
import TaskForm from "@/app/components/TaskForm";
import TaskList from "@/app/components/TaskList";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Task } from "@/app/types/task";

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery<{ myTasks: Task[] }>(GET_MY_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks = data?.myTasks || [];
  const filteredTasks = showCompleted ? tasks : tasks.filter(t => t.status !== "COMPLETED");

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({
        variables: { id },
      });
  
      await refetch(); // <--- Add this to re-fetch fresh tasks from server
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Dashboard</h1>
            <p className="text-gray-600">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} to complete
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaPlus /> New Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {showCompleted ? 'All Tasks' : 'Active Tasks'}
            </h2>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-blue-600 text-sm"
            >
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </button>
          </div>

          <TaskList 
            tasks={filteredTasks}
            onEdit={setSelectedTask}
            onDelete={handleDelete}
          />
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