import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../services/types';
import {EditComponent} from '../edit/edit.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, EditComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  showEditModal = false;
  editMode: 'create' | 'edit' = 'create';
  selectedTask: Task | null = null;

  readonly uniqueAssignees = computed(() =>
    [...new Set(this.dataService.tasks().map(t => t.assignee))]
  );

  readonly uniquePriorities = computed(() =>
    [...new Set(this.dataService.tasks().map(t => t.priority))]
  );

  readonly uniqueTags = computed(() =>
    [...new Set(this.dataService.tasks().flatMap(t => t.tags))]
  );

  constructor(public dataService: DataService) {}

  getColumnTasks(columnId: string) {
    return this.dataService.tasksByColumn()[columnId] || [];
  }

  onAssigneeFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.dataService.updateFilters({
      ...this.dataService.filterState(),
      assignee: value || undefined
    });
  }

  onPriorityFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.dataService.updateFilters({
      ...this.dataService.filterState(),
      priority: value || undefined
    });
  }

  onTagFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.dataService.updateFilters({
      ...this.dataService.filterState(),
      tag: value || undefined
    });
  }

  openCreateTask() {
    this.editMode = 'create';
    this.selectedTask = null;
    this.showEditModal = true;
  }

  openEditTask(task: Task) {
    this.editMode = 'edit';
    this.selectedTask = task;
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.selectedTask = null;
  }

  onTaskSave(task: Task) {
    if (this.editMode === 'create') {
      this.dataService.createTask({
        ...task,
        columnId: this.dataService.columns()[0].id // Place in first column by default
      });
    } else {
      this.dataService.updateTask(task.id, task);
    }
    this.closeModal();
  }

  onDrop<T>(event: CdkDragDrop<T>) {
    if (event.previousContainer.id === event.container.id) return;
    this.dataService.moveTask(event.item.data, event.container.id);
  }

}
