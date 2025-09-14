import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Task } from '../../services/types';
import { CommonModule } from '@angular/common';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
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
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  
  // Chip list settings
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags = signal<string[]>([]);
  tagControl = new FormControl('');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize tags
    this.tags.set(this.task?.tags || []);
    
    this.form = this.fb.group({
      title: [this.task?.title ?? '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description ?? ''],
      priority: [this.task?.priority ?? 'P3'],
      assignee: [this.task?.assignee ?? ''],
      // Tags will be managed separately using the chip list
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.titleInput?.nativeElement.focus();
    }, 0);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    // Add tag
    if (value) {
      const currentTags = this.tags();
      if (!currentTags.includes(value)) {
        this.tags.update(tags => [...tags, value]);
      }
    }
    
    // Clear the input value
    event.chipInput!.clear();
    this.tagControl.setValue('');
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const task: Task = {
        ...this.task,
        ...formValue,
        id: this.task?.id ?? `task-${Date.now()}`,
        tags: this.tags(),
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
