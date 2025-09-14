import { Component, Input, ChangeDetectionStrategy, signal, Output, EventEmitter } from '@angular/core';
import { Task } from '../../services/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  // Drag state signal
  private isDragging = signal(false);

  get priorityColor(): string {
    switch (this.task.priority) {
      case 'P1': return 'red';
      case 'P2': return 'orange';
      case 'P3': return 'green';
      default: return 'gray';
    }
  }

  onDragStart() {
    this.isDragging.set(true);
  }

  onDragEnd() {
    this.isDragging.set(false);
  }

  editTask() {
    this.edit.emit(this.task);
  }

  deleteTask() {
    this.delete.emit(this.task.id);
  }
}
