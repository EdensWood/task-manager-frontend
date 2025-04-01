"use client";
import { Task } from "@/app/types/task";
import { FaEdit, FaTrash } from "react-icons/fa";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const statusStyles = {
    COMPLETED: {
      container: 'bg-green-100 border-green-200',
      text: 'text-green-800',
      statusBadge: 'bg-green-200 text-green-800'
    },
    PENDING: {
      container: 'bg-amber-100 border-amber-200',
      text: 'text-amber-800',
      statusBadge: 'bg-amber-200 text-amber-800'
    },
    IN_PROGRESS: {
      container: 'bg-yellow-100 border-yellow-200',
      text: 'text-yellow-800',
      statusBadge: 'bg-yellow-200 text-yellow-800'
    }
  };

  const styles = statusStyles[task.status as keyof typeof statusStyles] || {
    container: 'bg-gray-100 border-gray-200',
    text: 'text-gray-800',
    statusBadge: 'bg-gray-200 text-gray-800'
  };

  return (
    <div className={`p-3 rounded-md mt-2 flex justify-between items-center border ${styles.container}`}>
      <div className={`flex-1 ${styles.text}`}>
        <h4 className="font-medium">{task.title}</h4>
        {task.description && (
          <p className="text-sm mt-1">{task.description}</p>
        )}
        <span className={`text-xs px-2 py-1 rounded-full ${styles.statusBadge}`}>
          {task.status.toLowerCase().replace('_', ' ')}
        </span>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => onEdit(task)}
          className={`hover:opacity-75 transition-opacity ${styles.text}`}
          aria-label="Edit task"
        >
          <FaEdit size={18} />
        </button>
        <button 
          onClick={() => onDelete(task.id ?? '')}
          className={`hover:opacity-75 transition-opacity ${styles.text}`}
          aria-label="Delete task"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
}