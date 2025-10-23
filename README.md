# DemoProject

A modern React web application built with TypeScript and Vite.

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npm run test:run
```

Run tests with UI:

```bash
npm run test:ui
```

### Linting

```bash
npm run lint
```

## Project Structure

```
DemoProject/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── assets/      # Images, fonts, etc.
│   ├── App.tsx      # Main App component
│   ├── App.css      # App styles
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles
├── tests/           # Test files
└── vite.config.ts   # Vite configuration
```