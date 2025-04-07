"use client";
import { Task } from "@/app/types/task";
import { FaEdit, FaTrash} from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const statusMap = {
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      icon: "🕒"
    },
    IN_PROGRESS: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-100",
      icon: "🚧"
    },
    COMPLETED: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-100",
      icon: "✅"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800">Delete Task</h3>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className={`p-4 hover:bg-gray-50 transition-colors ${task.status === "COMPLETED" ? "opacity-80" : ""}`}>
        <div className="flex items-start gap-3">
          <div className={`mt-1 flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full ${status.bg} ${status.border}`}>
            <span className="text-xs">{status.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium ${status.text}`}>{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
                {task.status.toUpperCase().replace("_", " ")}
              </span>
              {/* <span className="text-xs text-gray-500">
                {new Date(task.createdAt).toLocaleDateString()}
              </span> */}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              aria-label="Edit task"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              aria-label="Delete task"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}