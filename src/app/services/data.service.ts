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

  moveTask(taskId: string, targetColumnId: string): void {
    const columns = this.columns();
    const targetColumn = columns.find(col => col.id === targetColumnId);

    if (!targetColumn) return;

    const tasksInTargetColumn = this.tasksByColumn()[targetColumnId].length;
    if (tasksInTargetColumn >= targetColumn.wipLimit) return;

    this.updateTask(taskId, { columnId: targetColumnId });
  }
}
