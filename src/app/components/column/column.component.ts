import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Column } from '../../services/types';
import { CdkDropList, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnComponent {
  @Input() column!: Column;
  @Output() addTask = new EventEmitter<void>();
  @Output() taskDropped = new EventEmitter<CdkDragDrop<any>>();

  onAddTask() {
    this.addTask.emit();
  }

  onDrop(event: CdkDragDrop<any>) {
    this.taskDropped.emit(event);
  }

  get isAtWipLimit(): boolean {
    return this.column.wipLimit !== undefined &&
      (this.column.tasks?.length ?? 0) >= this.column.wipLimit;
  }

  get isNearWipLimit(): boolean {
    return this.column.wipLimit !== undefined &&
      (this.column.tasks?.length ?? 0) === this.column.wipLimit - 1;
  }
}
