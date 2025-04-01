import { Task } from "../types/task";
import TaskItem from "./TaskItem";

// components/TaskList.tsx
interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
  }
  
  export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">Your Tasks</h3>
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    );
  }