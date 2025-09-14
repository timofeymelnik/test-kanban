import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../services/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, AfterViewInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task: Task | null = null;
  @Input() columnId?: string;
  
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.task?.title ?? '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description ?? ''],
      priority: [this.task?.priority ?? 'P3'],
      assignee: [this.task?.assignee ?? ''],
      tags: [this.task?.tags ?? []]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.titleInput?.nativeElement.focus();
    }, 0);
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const task: Task = {
        ...this.task,
        ...formValue,
        id: this.task?.id ?? `task-${Date.now()}`,
        tags: formValue.tags || [],
        columnId: this.task?.columnId || this.columnId || ''
      };
      
      this.save.emit(task);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get titleError(): string | null {
    const control = this.form.get('title');
    if (control?.touched && control.invalid) {
      if (control.errors?.['required']) return 'Title is required';
      if (control.errors?.['minlength']) return 'Title must be at least 3 characters';
    }
    return null;
  }

  get descriptionError(): string | null {
    return null;
  }

  get priorityOptions(): { value: string; label: string }[] {
    return [
      { value: 'P1', label: 'High Priority' },
      { value: 'P2', label: 'Medium Priority' },
      { value: 'P3', label: 'Low Priority' }
    ];
  }
}
