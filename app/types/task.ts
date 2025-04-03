// types/task.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }
  
  export type TaskFormProps = {
    task?: Task;
    onClose: () => void;
    onSuccess?: () => void;
  };