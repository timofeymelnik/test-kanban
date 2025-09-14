import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board, Task, Column } from './types';
import { StorageService } from './storage.service';

interface FilterState {
  assignee?: string;
  priority?: string;
  tag?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly boardState = signal<Board>({ columns: [], tasks: [] });
  filterState = signal<FilterState>({});

  readonly columns = computed(() => this.boardState().columns);
  readonly tasks = computed(() => this.boardState().tasks);

  readonly filteredTasks = computed(() => {
    const filters = this.filterState();
    return this.tasks().filter(task => {
      if (filters.assignee && task.assignee !== filters.assignee) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.tag && !task.tags.includes(filters.tag)) return false;
      return true;
    });
  });

  readonly tasksByColumn = computed(() => {
    const filtered = this.filteredTasks();
    return this.columns().reduce((acc, col) => ({
      ...acc,
      [col.id]: filtered.filter(task => task.columnId === col.id)
    }), {} as Record<string, Task[]>);
  });

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    const stored = this.storage.loadState<Board>('board');
    if (stored) {
      this.boardState.set(stored);
      return;
    }

    const seed = await this.http.get<Board>('/seed.json').toPromise();
    if (seed) {
      this.boardState.set(seed);
      this.syncStorage();
    }
  }

  private syncStorage(): void {
    this.storage.saveState('board', this.boardState());
  }

  createTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };

    this.boardState.update(board => ({
      ...board,
      tasks: [...board.tasks, newTask]
    }));
    this.syncStorage();
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): void {
    this.boardState.update(board => ({
      ...board,
      tasks: board.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    }));
    this.syncStorage();
  }

  deleteTask(id: string): void {
    this.boardState.update(board => ({
      ...board,
      tasks: board.tasks.filter(task => task.id !== id)
    }));
    this.syncStorage();
  }

  updateFilters(filters: FilterState): void {
    this.filterState.set(filters);
  }

  clearFilters(): void {
    this.filterState.set({});
  }

  moveTask(taskId: string, targetColumnId: string, targetIndex: number = -1): void {
    const columns = this.columns();
    const targetColumn = columns.find(col => col.id === targetColumnId);
  
    if (!targetColumn) return;
  
    const tasksInTargetColumn = this.tasksByColumn()[targetColumnId].length;
    if (targetColumn.wipLimit !== undefined && tasksInTargetColumn >= targetColumn.wipLimit) return;
  
    // First, remove the task from its current position
    this.boardState.update(board => {
      const taskIndex = board.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return board;
  
      const updatedTasks = [...board.tasks];
      const [task] = updatedTasks.splice(taskIndex, 1);
      
      // If targetIndex is specified, insert at that position
      // Otherwise, add to end of target column
      const updatedTask = {
        ...task,
        columnId: targetColumnId
      };
      
      if (targetIndex >= 0) {
        // Find the proper position to insert the task
        const targetColumnTasks = updatedTasks.filter(t => t.columnId === targetColumnId);
        const totalTasks = updatedTasks.length;
        
        // Find where to insert in the main array
        if (targetColumnTasks.length === 0) {
          // No tasks in target column, just append
          updatedTasks.push(updatedTask);
        } else if (targetIndex >= targetColumnTasks.length) {
          // Insert after the last task in the column
          const lastTaskIndex = updatedTasks.findIndex(t => 
            t.id === targetColumnTasks[targetColumnTasks.length - 1].id
          );
          updatedTasks.splice(lastTaskIndex + 1, 0, updatedTask);
        } else {
          // Insert at the correct position
          const targetTask = targetColumnTasks[targetIndex];
          const targetTaskIndex = updatedTasks.findIndex(t => t.id === targetTask.id);
          updatedTasks.splice(targetTaskIndex, 0, updatedTask);
        }
      } else {
        // Just append to the end
        updatedTasks.push(updatedTask);
      }
      
      return {
        ...board,
        tasks: updatedTasks
      };
    });
    
    this.syncStorage();
  }
  
  reorderTask(taskId: string, columnId: string, previousIndex: number, currentIndex: number): void {
    if (previousIndex === currentIndex) return;
    
    this.boardState.update(board => {
      // Get all tasks in the column
      const columnTasks = board.tasks
        .filter(t => t.columnId === columnId)
        .map(t => ({ ...t }));
      
      if (columnTasks.length <= 1) return board;
      
      // Reorder the tasks within the column
      const [movedTask] = columnTasks.splice(previousIndex, 1);
      columnTasks.splice(currentIndex, 0, movedTask);
      
      // Create a new tasks array with the updated order
      const tasksNotInColumn = board.tasks.filter(t => t.columnId !== columnId);
      const updatedTasks = [...tasksNotInColumn, ...columnTasks];
      
      return {
        ...board,
        tasks: updatedTasks
      };
    });
    
    this.syncStorage();
  }
}
