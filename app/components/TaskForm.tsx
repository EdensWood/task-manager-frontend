/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { Task } from "@/app/types/task";

const TASK_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
} as const;


interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSuccess?: () => void;
}

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String, $status: String!) {
    createTask(title: $title, description: $description, status: $status) {
      id
      title
      description
      status
      user {
        id
        name
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $status: String) {
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
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || TASK_STATUS.PENDING
    }
  });

  const [saveTask, { loading }] = useMutation(
    task?.id ? UPDATE_TASK : CREATE_TASK,
    {
      onCompleted: () => {
        toast.success(task?.id ? "Task updated!" : "Task created!");
        onSuccess?.();
        onClose();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      }
    }
  );

  const onSubmit = (data: any) => {
    const variables = task?.id 
      ? { id: task.id, ...data }
      : data;
    
    saveTask({ variables });
  };

  return (
    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {task?.id ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              {...register("title", { required: true })}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">Title is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(TASK_STATUS).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isDirty}
              className={`px-4 py-2 text-white rounded-md ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : task?.id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}