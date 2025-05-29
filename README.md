# AI Assistant

A sophisticated AI-powered chat interface for traders and analysts, built with React, TypeScript, and Material UI. This application provides real-time AI assistance with advanced chat features, workspace management, and file handling capabilities.

## Features

- 💬 Real-time token-by-token streaming responses
- 📁 Chat organization by AI agents
- 🔍 Full-text search across chat history
- 📎 File attachment support (images, PDFs, documents)
- 🌓 Light/dark mode toggle
- 💾 Persistent storage using IndexedDB
- ⚡ Optimized performance for large chat histories

## Tech Stack

- React 18+ with TypeScript
- Material UI (MUI) for UI components
- Lucide React for icons
- WebSocket for real-time communication
- IndexedDB for data persistence
- Vite for development and building

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
├── context/            # React Context providers
├── services/           # Business logic and utilities
├── types/              # TypeScript interfaces
└── App.tsx            # Root component
```

## Key Components

### Chat Interface
- Two-column layout with sidebar and main chat view
- Real-time message streaming with token-wise output
- File upload support with preview capabilities
- Markdown rendering for messages

### Agent System
- Create and manage multiple AI agents
- Customize system prompts and model parameters
- Agent-specific chat organization

### State Management
- React Context API with useReducer for global state
- Optimized re-renders with proper memoization
- Persistent storage with IndexedDB

### Real-time Communication
- WebSocket-based streaming implementation
- Reconnection logic with exponential backoff
- Interruptible message generation

## Error Handling

The application implements comprehensive error handling for:
- WebSocket connection failures
- File upload validation
- Storage quota management
- Agent configuration validation
- Browser compatibility issues

## Performance Optimizations

- Efficient chat history rendering
- Optimized real-time updates
- Lazy loading of chat content
- Proper cleanup of WebSocket connections
- Memory leak prevention

## Browser Support

Supports all modern browsers with WebSocket and IndexedDB capabilities:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development

### Code Style
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type safety

### Testing
- Jest for unit testing
- React Testing Library for component testing

### Building
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```