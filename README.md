# Chat System Server

A Node.js/TypeScript chat server application with automated code quality checks.

## 🚀 Features

- Express.js server with TypeScript
- MongoDB integration with Mongoose
- JWT authentication
- Automated code quality checks with Husky
- ESLint and Prettier configuration
- Type checking before deployment

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Chat-System-Server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp envs/.env.example envs/.env
# Edit envs/.env with your configuration
```

## 🏃‍♂️ Development

### Start development server:

```bash
npm run dev
```

### Build the project:

```bash
npm run build
```

### Start production server:

```bash
npm start
```

## 🔧 Code Quality

### Linting:

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors automatically
```

### Formatting:

```bash
npm run prettier      # Check code formatting
npm run prettier:fix  # Fix formatting automatically
```

### Type Checking:

```bash
npm run type-check    # Check TypeScript types without emitting files
```

## 🐕 Husky Hooks

This project uses Husky to ensure code quality before commits and pushes:

### Pre-commit Hook

- Automatically runs `lint-staged` on staged files
- Fixes ESLint errors and Prettier formatting
- Only processes files that are staged for commit

### Pre-push Hook

- Runs TypeScript type checking (`tsc --noEmit`)
- Builds the project to ensure no compilation errors
- Prevents pushing code with type errors or build failures

### How it works:

1. When you commit: `git commit -m "your message"`
   - Husky runs `lint-staged` on staged files
   - ESLint fixes errors automatically
   - Prettier formats code automatically
   - If any errors remain, commit is blocked

2. When you push: `git push`
   - Husky runs type checking
   - Husky builds the project
   - If type errors or build failures exist, push is blocked

### Bypassing hooks (emergency only):

```bash
git commit -m "message" --no-verify  # Skip pre-commit hook
git push --no-verify                 # Skip pre-push hook
```

## 📁 Project Structure

```
src/
├── apis/           # API routes and controllers
├── config/         # Configuration files
├── constants/      # Constants and enums
├── controllers/    # Business logic controllers
├── database/       # Database connection and setup
├── middlewares/    # Express middlewares
├── models/         # Mongoose models
├── routes/         # Route definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── index.ts        # Server entry point
```

## 🚀 Deployment

### Render.com

- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Node.js

### Environment Variables

Make sure to set these in your deployment environment:

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m "Add feature"`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the ISC License.
