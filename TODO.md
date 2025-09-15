# TODO

## 1. RxJS instead of Signals
- **What to do:** Replace Angular Signals with RxJS streams (`BehaviorSubject`, `Observable`, `pipe`) in `DataService`.
- **Why:** The assignment explicitly required RxJS for state management and reactivity.
- **Effort:** M (medium).
- **Approach:**
  - Create `BehaviorSubject<Board>` for board state.
  - Derive observables for `tasks`, `columns`, `filteredTasks`, `tasksByColumn`.
  - Replace `signal`/`computed` with `pipe(map(...))` chains.
  - Update components to subscribe via `async` pipe.

---

## 2. Accessibility (a11y / ARIA)
- **What to do:** Add ARIA attributes and roles to interactive elements (tasks, columns, filters).
- **Why:** Improves accessibility for screen readers and keyboard navigation; required by assignment.
- **Effort:** S (small).
- **Approach:**
  - Add `role="list"`, `role="listitem"`, `aria-label`, `aria-describedby` to task/column elements.
  - Ensure drag&drop provides keyboard support or fallback.
  - Validate with Lighthouse/axe-core.

---

## 3. E2E Smoke Tests
- **What to do:** Implement e2e tests to verify core flows (create task, move between columns, apply filter).
- **Why:** Ensures functionality works end-to-end; was explicitly required in assignment.
- **Effort:** L (large).
- **Approach:**
  - Add Cypress (preferred) or Playwright.
  - Write smoke tests:
    - Open board and load data.
    - Drag task from Backlog → In Progress.
    - Apply filter (e.g., priority) and verify.
    - Reload page and confirm persistence.
  - Integrate with CI (GitHub Actions).

---

## 4. Unit Tests
- **What to do:** Extend `.spec.ts` files with real tests for `DataService`, filtering logic, drag&drop behavior.
- **Why:** Improves reliability and coverage.
- **Effort:** M (medium).
- **Approach:**
  - Use Jasmine/Karma or Jest.
  - Test `filteredTasks` with different filter combinations.
  - Test WIP enforcement logic.
  - Test LocalStorage persistence.

---

## 5. WIP Enforcement
- **What to do:** Ensure drag&drop enforces `wipLimit` defined on columns.
- **Why:** Requirement from Kanban methodology; prevents exceeding work-in-progress limits.
- **Effort:** S (small).
- **Approach:**
  - Provide UI feedback (toast, error message).

---

## 6. UI/UX Improvements
- **What to do:** Enhance styling and clarity (task cards, column headers, priority indicators).
- **Why:** Improves usability and aligns with typical Kanban apps.
- **Effort:** S (small).
- **Approach:**
  - Highlight columns on drag hover.
