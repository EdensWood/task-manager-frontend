// types/task.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    user:{
      id: string;
      name: string;
      email: string;
    }
  }
  
  export type TaskFormProps = {
    task?: Task;
    onClose: () => void;
    onSuccess?: () => void;
  };