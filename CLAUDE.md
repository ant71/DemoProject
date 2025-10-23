# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React web application built with TypeScript and Vite. The project uses modern React practices with functional components and hooks.

## Common Commands

### Development
- `npm run dev` - Start development server (runs on port 3000)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run tests in watch mode (Vitest)
- `npm run test:run` - Run tests once (for CI)
- `npm run test:ui` - Open Vitest UI for interactive testing

### Code Quality
- `npm run lint` - Run ESLint on TypeScript files

## Architecture

### Tech Stack
- **React 19** with TypeScript
- **Vite** for fast builds and HMR
- **Vitest** for unit testing with Testing Library
- **ESLint** with TypeScript and React Hooks plugins

### Directory Structure
- `src/` - Application source code
  - `components/` - Reusable React components
  - `assets/` - Static assets (images, fonts)
  - `main.tsx` - Application entry point (renders React root)
  - `App.tsx` - Main application component
- `tests/` - Test files (using Vitest + Testing Library)
- `public/` - Static files served directly (index.html)

### Key Configuration Files
- `vite.config.ts` - Vite configuration (includes Vitest setup)
- `tsconfig.json` - TypeScript compiler options for source code
- `tsconfig.node.json` - TypeScript options for config files
- `eslint.config.js` - ESLint flat config with TypeScript rules

## Development Patterns

### Component Structure
- Use functional components with TypeScript
- Props should be typed with interfaces
- Place component-specific styles in separate CSS files
- Use CSS modules for component-scoped styles when needed

### Testing
- Tests are located in the `tests/` directory
- Use Testing Library for component tests
- Test setup is in `tests/setup.ts` (includes cleanup and jest-dom matchers)
- Write tests that focus on user behavior, not implementation details

### State Management
- Currently using React built-in state (useState, useContext)
- For larger state needs, consider adding a state management library

## Running a Single Test

```bash
npm test -- App.test.tsx
```
