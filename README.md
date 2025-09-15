# KanbanTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

## Development server

To start a local development server, run:

```bash
ng serve
```


Implemented
    1.	Kanban Board Structure
        •	Columns Backlog, In Progress, Review, Done are defined in types and used in components (board, column).
        •	Files: src/app/services/types.ts, board/, column/.
    2.	Tasks and Fields
        •	Types include id, title, description, assignee, priority, tags.
        •	File: src/app/services/types.ts.
    3.	Filtering
        •	Implemented by title, tags, assignee, priority.
        •	Template: filter/filter.component.html.
        •	Logic: data.service.ts (via signals filterState, filteredTasks).
    4.	Drag & Drop
        •	Implemented with Angular CDK (CdkDragDrop, CdkDropList, DragDropModule).
        •	Files: board.component.ts, column.component.ts.
    5.	State Persistence
        •	StorageService works with LocalStorage.
        •	File: src/app/services/storage.service.ts.
    6.	Logic Separation
        •	Architecture split into components and services.
        •	Angular Signals (signal, computed) are used for state management.
    7.	ChangeDetectionStrategy.OnPush