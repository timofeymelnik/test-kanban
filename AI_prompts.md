# AI Prompts

### Data Storage Service
Create StorageService for LocalStorage:  
- Methods saveState(), loadState(), clearState() with typing  
- Automatic JSON serialization with error handling  
- Check localStorage availability  

### Main BoardService with Signals
Create BoardService with Angular signals:  
- Private signals: _boardState, _filterState  
- Computed signals: columns, tasks, filteredTasks, tasksByColumn  
- CRUD methods: createTask(), updateTask(), deleteTask()  
- moveTask() for drag & drop with WIP limit validation  
- updateFilter(), clearFilters() for filtering  
- loadSeedData() and auto-save through StorageService  
- WIP logic: isNearWipLimit(), isAtWipLimit()  

### Task Card Component
Create TaskCardComponent with OnPush:  
- Display all task fields  
- Priority color indication (P1-red, P2-orange, P3-green)  
- Edit and delete buttons  
- ARIA attributes for accessibility  
- CSS styles for drag states (.cdk-drag-dragging, .cdk-drag-placeholder)  
- Use @if/@for syntax  

### Column Component with Drag & Drop
Create ColumnComponent with OnPush:  
- Header, task counter (X/WIP), add button  
- Angular CDK: cdkDropList with drop event handling  
- Visual warnings for WIP limits  
- Empty state, responsive design  
- CSS styles for drop zones (.cdk-drop-list-receiving)  

### Task Creation/Editing Form
Create TaskFormComponent with reactive forms:  
- FormBuilder with validation (title required field)  
- Fields: title, description, assignee, priority (dropdown P1/P2/P3), columnId (dropdown), tags (comma-separated)  
- Create/edit modes  
- Modal window with proper focus management  
- Show validation errors, OnPush strategy  

### Filter Component
Create FilterComponent with reactive forms:  
- Search by title/tags with debounce  
- Dropdown filters: assignee (dynamic list), priority  
- Clear filters button  
- Integration with BoardService through signals  
- OnPush strategy, modern @for syntax  

### Main BoardComponent
Create BoardComponent as main container:  
- OnPush strategy, integration of all child components  
- cdkDropListGroup for cross-column drag & drop  
- Handle all drag & drop events with WIP validation  
- Modal form window management  
- Responsive grid layout, load seed data on startup  

### Angular CDK Drag & Drop Setup
Configure complete drag & drop:  
- DragDropModule in imports of all needed components  
- cdkDropListGroup in BoardComponent  
- cdkDropList for columns, cdkDrag for cards  
- Handle moveItemInArray and transferArrayItem  
- Validate WIP limits before drop  
- CSS animations and visual feedback  

### Styling and Animations
Create modern CSS styles:  
- Responsive grid for columns with horizontal scroll  
- Cards: shadows, rounded corners, hover effects  
- Drag & drop states: dragging, placeholder, receiving  
- Priority color scheme, consistent spacing  
- Mobile responsiveness  

### Accessibility and UX
Implement accessibility features:  
- ARIA attributes for all interactive elements  
- Keyboard navigation: Tab, Enter, Escape, Arrow keys  
- Focus management in modal windows  
- Screen reader support, semantic HTML  
- Visual focus indicators, color contrast compliance  

### Final Integration and Testing
Complete the application:  
1. Update app.component to use BoardComponent  
2. Test all features: task create/edit, drag & drop between columns, filtering, WIP limits  
3. Create 2-3 unit tests for BoardService (CRUD, moveTask)  
4. Add README.md with instructions  
5. Test persistence through LocalStorage  

## Developer Notes

- Edit board component to include forms to edit/create task modal and include filter component  
- Add columns component which will hold tasks components  
- Use OnPush strategy and @for syntax  
- Use cdkDropListGroup to handle cross column drag and drop  
- Handle all drag and drop events with WIP validation  
- Add CSS grid styles for columns  
- Seed data should be retrieved from data service  
- Refactor data service to use Angular signals:  
  - Private signals: boardState, filterState  
  - Computed signals: columns, tasks, filteredTasks, tasksByColumn  
- Create update and delete tasks methods  
- Load seed data from JSON file and sync with StorageService  
- Add updateFilters and clearFilters methods  
- Implement moveTask for drag and drop functionality  
- Update board component to use this data service  
- Add create/edit modal component to the board component  
- Use already existing edit modal window and add button with add task to the header of board and edit button to each task  
- Using edit component add functionality to edit and create task inside of the modal window  
- Connect edit component to the data service  
- Show validation errors in the modal form  
- Fix this file, combine functionality with data service  
- Use `showEditModal` to open modal  
- Use edit component to show edit/create modal window and connect it to the board component by create/edit buttons and data service  
- Remove duplicated functionality and duplicate form items inside modal (only one set of form inputs should remain)  
- Fix drag and drop functionality and check if the position inside of the column is persistent to the dropped position  
- Fix error:  
  - ✘ [ERROR] NG2: Object is possibly 'undefined'. [plugin angular-compiler]  
    src/app/components/board/board.component.html:72:19  
- Fix error:  
  - ✘ [ERROR] NG5002: Parser Error: Bindings cannot contain assignments at column 30 in [dataService.columns().map(c => c.id)] in /Users/tim/WebstormProjects/kanban-test/src/app/components/board/board.component.html@53:39 [plugin angular-compiler]  
- Add possibility to edit and create tags  
- Fix styles of inputs inside of the edit/create form to fit inside of the modal window
