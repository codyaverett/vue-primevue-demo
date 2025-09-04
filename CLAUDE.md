# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Vite dev server at http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Architecture

### Stack
- **Vue 3** with Composition API
- **PrimeVue 3** for UI components  
- **Pinia** for state management
- **Vue Router** for navigation
- **Vite** as build tool
- **localStorage** for data persistence (mock API in `services/api.js`)

### Route Structure
- `/` - Redirects to dashboard
- `/dashboard` - KPI overview page
- `/ideas` - Ideas list/workspace
- `/submit` - Complex multi-section form for submitting ideas
- `/style-guide` - Design system showcase

### State Management
The ideas store (`stores/ideas.js`) is the central data layer using Pinia composition API pattern:
- Manages all idea CRUD operations through mock API
- Provides computed `stats` for dashboard KPIs
- Handles loading/error states
- Auto-refreshes after mutations

### Data Model
Ideas have the following structure (see `assets/ideas.json`):
- `id`, `title`, `description`, `status`, `category`
- `tags` (array), `votes` (number), `createdAt` (ISO date)
- Additional fields added via form: personas, impact score, complexity, dependencies, etc.

### API Layer
Mock API (`services/api.js`) simulates backend with:
- Artificial delays (150-300ms) for realistic UX
- localStorage persistence under key `pv_ideas`
- Auto-seeds from `assets/ideas.json` on first load
- UUID generation for new items

### Component Patterns
- Use `<script setup>` syntax for all components
- PrimeVue components imported as needed (not globally registered)
- PrimeFlex for utility-first CSS layout
- Composition API for all logic

## Key Implementation Requirements

### Submit Form (`/submit`)
Complex multi-section form with:
1. **Idea Basics**: title, description, category, tags
2. **Impact & Priority**: personas, impact score, expected reach, target date  
3. **Technical**: complexity, dependencies, repo URL, privacy settings
4. **Contact & Meta**: requester info, notifications, consent

Must include:
- Inline + summary validation
- Keyboard navigation support
- Screen reader labels
- Save Draft to localStorage
- Responsive layout

### Ideas Workspace
- DataTable with sorting, filtering, pagination
- Column show/hide toggle
- Search across title/description/tags
- Multi-filter bar (category, status, tags)
- Upvoting with immediate feedback
- CRUD operations (modal or inline)

### Theme Support
- PrimeVue theme switching (saga-blue default)
- Light/dark mode toggle
- Keyboard shortcuts
- Screen reader support

## Package Version Commit Format
After completing work, recommend commits in commitizen format including package version:
```
feat(ideas): implement complex submit form - v0.1.0
```
Then update package.json version and create git tag.