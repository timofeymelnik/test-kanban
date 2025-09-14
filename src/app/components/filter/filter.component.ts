import { Component, ChangeDetectionStrategy, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BoardComponent } from '../board/board.component';
import { debounceTime } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
  @Input() board!: BoardComponent;

  form!: FormGroup;
  assignees: string[] = [];
  priorities: string[] = ['P1', 'P2', 'P3'];

  ngOnInit(): void {
    const fb = inject(FormBuilder);
    this.form = fb.group({
      title: [''],
      tags: [''],
      assignee: [''],
      priority: ['']
    });

    // Get unique assignees from board tasks
    this.assignees = Array.from(new Set(this.board.tasks().map(t => t.assignee).filter(Boolean)));

    // Debounced search for title and tags
    this.form.get('title')!.valueChanges.pipe(debounceTime(300)).subscribe(val => {
      this.board.updateFilter('title', val);
    });
    this.form.get('tags')!.valueChanges.pipe(debounceTime(300)).subscribe(val => {
      this.board.updateFilter('tags', val);
    });

    // Dropdown filters
    this.form.get('assignee')!.valueChanges.subscribe(val => {
      this.board.updateFilter('assignee', val);
    });
    this.form.get('priority')!.valueChanges.subscribe(val => {
      this.board.updateFilter('priority', val);
    });
  }

  clearFilters() {
    this.form.reset();
    this.board.clearFilters();
  }
}
