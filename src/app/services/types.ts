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
  position?: number; // Optional position field for explicit ordering
}

export interface Board {
  columns: Column[];
  tasks: Task[];
}
