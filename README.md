# Task Management Application

A modern task management application built with React, TypeScript, and Vite. Features include task creation, editing, deletion, Kanban board view, task filtering, and user authentication.

## Features

- 🔐 **User Authentication** - Secure login and registration
- ✅ **Task Management** - Create, read, update, and delete tasks
- 📋 **Multiple Views** - List view and Kanban board view
- 🎯 **Task Filtering** - Filter tasks by status, priority, and other criteria
- 🔄 **Drag & Drop** - Intuitive Kanban board with drag-and-drop functionality
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Built with Ant Design components and Tailwind CSS

## Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Ant Design (antd)
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Drag & Drop:** DND Kit
- **Date Handling:** Day.js & Moment.js
- **Notifications:** Sonner

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.x or higher)
- **npm** (version 9.x or higher) or **yarn**
- A running backend API server (default: `http://localhost:4000/api`)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
   
   Update `VITE_API_URL` to point to your backend API server.

## Running the Application

### Development Mode

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized build will be generated in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## Project Structure

```
task-management/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── TaskContext.tsx
│   ├── endpoints/           # API endpoint definitions
│   ├── features/
│   │   ├── mutations/       # React Query mutations
│   │   └── queries/         # React Query queries
│   ├── instance/            # Axios instance configuration
│   ├── lib/                 # Library configurations
│   ├── modules/
│   │   ├── auth/            # Authentication components
│   │   ├── routes/          # Route configurations
│   │   └── task-management/ # Task management features
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── dist/                    # Production build output
└── package.json
```

## API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/sign-up` - User registration
- `GET /auth/me` - Get current user

### Task Management
- `POST /task-management/task/add` - Create a new task
- `PUT /task-management/task/update` - Update a task
- `GET /task-management/task/get` - Get a specific task
- `GET /task-management/task/all` - Get all tasks
- `DELETE /task-management/task/remove` - Delete a task

## Authentication

The application uses JWT token-based authentication. Tokens are stored in `localStorage` and automatically included in API requests via Axios interceptors.

## Development

### Code Quality

This project uses ESLint for code quality. The configuration includes:
- TypeScript ESLint rules
- React Hooks rules
- React Refresh rules

### TypeScript Configuration

- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - Application-specific configuration
- `tsconfig.node.json` - Node.js environment configuration

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a custom port:

```bash
npm run dev -- --port 3000
```

### API Connection Issues

1. Ensure your backend server is running
2. Verify the `VITE_API_URL` in your `.env` file is correct
3. Check for CORS configuration on your backend

### Build Errors

If you encounter TypeScript errors during build:

```bash
npm run build
```

Check `tsconfig.json` and ensure all type definitions are correct.

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
