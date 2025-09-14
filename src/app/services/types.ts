export interface Column {
  id: string;
  title: string;
  wipLimit: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  tags: string[];
  columnId: string;
}

export interface Board {
  columns: Column[];
  tasks: Task[];
}
