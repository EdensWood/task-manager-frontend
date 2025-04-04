import { Task } from "../types/task";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";  // Import Framer Motion

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No tasks found. Create your first task!
        </div>
      ) : (
        <AnimatePresence> {/* Enables exit animations */}
          {tasks.map((task) => (
            <motion.div
              key={task.id}  // This ensures each item has a unique key
              initial={{ opacity: 0 }}  // Initial state (invisible)
              animate={{ opacity: 1 }}  // Animate to visible
              exit={{ opacity: 0 }}  // Fade out when removed
              transition={{ duration: 0.3 }}  // Duration of the fade
            >
              <TaskItem 
                task={task} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
