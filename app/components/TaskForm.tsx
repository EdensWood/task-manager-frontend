
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TaskForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

// Define status constants to match backend enum
const TASK_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
} as const;

type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskFormProps {
  task?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!, $status: String!) {
    createTask(title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!, $description: String!, $status: String!) {
    updateTask(id: $id, title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

export default function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<TaskFormValues>({ 
    defaultValues: task || { 
      title: "",
      description: "",
      status: TASK_STATUS.PENDING
    }
  });
  
  const [saveTask, { loading }] = useMutation(task?.id ? UPDATE_TASK : CREATE_TASK, {
    onCompleted: () => {
      toast.success(task?.id ? "Task updated successfully!" : "Task created successfully!");
      onSuccess?.();
      onClose();
      reset();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      console.error("Task submission error:", error);
    }
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      await saveTask({ 
        variables: task?.id 
          ? { ...data, id: task.id } 
          : data 
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {task?.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              {...register("title", { 
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters"
                }
              })}
              placeholder="Enter task title"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description 
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Enter task details(optional)"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {task?.id ? "Updating..." : "Creating..."}
                </span>
              ) : (
                task?.id ? "Update Task" : "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}