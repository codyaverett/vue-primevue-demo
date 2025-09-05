# Development Notes

## Initial Assessment

### Current State

The project is a Vue 3 application using the Composition API with PrimeVue 3 for UI components. It's set up as a feature request/idea management system with basic CRUD operations.

**Tech Stack:**

- Vue 3 (Composition API)
- PrimeVue 3 for UI components
- Pinia for state management
- Vue Router for navigation
- PrimeFlex for layout/grid
- localStorage for data persistence

### Areas Needing Improvement

- Form validation is minimal (only 3 fields validated)
- No accessibility considerations (ARIA labels, keyboard nav)
- Limited search/filter capabilities
- No data visualization on dashboard
- Missing responsive design optimizations
- No theme customization

---

## Todo List

### Phase 1: Form Enhancement (REQUIRED) ✅ Priority

- [x] Implement comprehensive validation system
- [x] Add auto-save draft functionality
- [ ] Improve accessibility (ARIA, keyboard navigation)
- [ ] Add helper text and tooltips
- [ ] Optimize mobile responsiveness

### Phase 2: Ideas Workspace

- [ ] Implement fuzzy search across all fields
- [ ] Add multi-select filtering
- [ ] Enhance sorting capabilities
- [ ] Improve pagination UX
- [ ] Add debounced upvoting

### Phase 3: Dashboard

- [ ] Add KPI metric cards
- [ ] Integrate D3.js for data visualization
- [ ] Create idea trends chart
- [ ] Add quick action buttons

### Phase 4: Theme & Polish

- [ ] Implement dark/light theme toggle
- [ ] Create style guide page
- [ ] Improve loading states
- [ ] Add animations/transitions

### Phase 5: Nice-to-haves

- [ ] Bulk selection and actions
- [ ] Export to CSV/JSON
- [ ] Keyboard shortcuts
- [ ] Inline editing

---

## Implementation Strategy

### Starting Point

Beginning with **Phase 1 (Form Enhancement)** as it's marked REQUIRED. The current form in `Submit.vue` has basic structure but lacks:

1. Real-time validation feedback
2. Draft persistence
3. Accessibility features
4. Mobile optimization

### Approach

- **Incremental commits** - Each feature as a separate commit for clear history
- **Composables first** - Extract reusable logic into composables
- **Accessibility focus** - ARIA labels, keyboard navigation, screen reader support
- **Performance conscious** - Debouncing, lazy loading, optimistic updates

### Technology Choices

**Form Validation**: VeeValidate v4

- Designed for Vue 3 Composition API
- Declarative validation rules
- Built-in accessibility

**Search**: Fuse.js

- Fuzzy matching for better UX
- Client-side performance
- Small bundle size

**Visualizations**: D3.js

- Maximum flexibility for custom charts
- Rich animation capabilities
- Direct SVG control

**Themes**: PrimeVue built-in themes + CSS variables

- Runtime switching capability
- System preference detection
- No additional dependencies

---

## Design Decisions

### Component Architecture

- Keep components focused and single-purpose
- Extract complex logic to composables
- Use Pinia for shared state
- Props for configuration, events for communication

### UX Principles

- **Immediate feedback** - Optimistic updates, loading states
- **Forgiveness** - Undo actions (maybe), confirm destructive operations (definetly)
- **Accessibility** - Keyboard navigable, screen reader friendly
- **Performance** - Debounced inputs, virtual scrolling for large lists

### Code Style

- Vue Composition API
- Consistent PrimeVue component usage
- Mobile-first responsive design
- Nice

---

## Dev Log

### Hour 1

- Created implementation plan documentation
- Set up todo list for tracking work
- Familiarized myself with the existing codebase structure
- Identified key areas for improvement
    - There are no tests
    - Form styling and bland design using default theme colors
    - There is no indicator to help a user know how many fields they have left to fill out
    - Page navigation state
- Decided to use pnpm over npm (if you know, you know)
- I set up precommit hooks and lint-staged to format, lint, and build the code to minimize the chances of broken code being commited

#### Starting form validation tasks

- Pulling in vee-validation because it seems like it will help with all the things we need for form validation
- > VeeValidate is the most popular Vue.js form library. It takes care of value tracking, validation, errors, submissions and more.
- Ran into some issues with form state. VeeValidate's v-bind="field" wasn't providing the correct binding
  format. By explicitly using :modelValue="value" and @update:modelValue="handleChange" from
  VeeValidate's slot props

### Hour 2

---
