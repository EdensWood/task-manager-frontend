"use client";
import { Task } from "@/app/types/task";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const statusMap = {
    PENDING: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200"
    },
    IN_PROGRESS: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200"
    },
    COMPLETED: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200"
    }
  };

  const status = statusMap[task.status] || statusMap.PENDING;

  const confirmDelete = () => {
    onDelete(task.id);
    setShowConfirmDelete(false);
  };

  return (
    <>
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold">Are you sure?</h3>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`p-4 mb-3 rounded-lg border ${status.bg} ${status.border}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium ${status.text}`}>{task.title}</h3>
            {task.description && (
              <p className="text-sm mt-1 text-gray-600">{task.description}</p>
            )}
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${status.bg} ${status.text}`}
            >
              {task.status.toLowerCase().replace("_", " ")}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Edit task"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-gray-500 hover:text-red-500"
              aria-label="Delete task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
