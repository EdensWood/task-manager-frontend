import { Task } from "../types/task";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  return (
    <div className="divide-y divide-gray-100">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TaskItem 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}