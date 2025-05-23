# Employee Training Todo Application

## Overview

The Employee Training Todo application is designed to help organizations track employee training tasks efficiently. It allows users to manage their training tasks, set reminders, and monitor completed tasks.

## Features

- **User Authentication**: Employees can log in to access their training tasks.
- **Task Management**: Users can add, remove, and mark training tasks as completed.
- **Reminders**: Set reminders for specific tasks to ensure timely completion.
- **Dashboard**: View overall status of tasks and navigate to different sections of the application.
- **Completed Tasks**: A dedicated page to view all tasks that have been completed.

## Project Structure

```
employee-training-todo
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── TodoList.js
│   │   ├── TodoItem.js
│   │   └── Reminder.js
│   ├── pages
│   │   ├── Dashboard.js
│   │   ├── CompletedTasks.js
│   │   └── Login.js
│   ├── styles
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── todo.css
│   │   └── dashboard.css
│   ├── App.js
│   ├── index.js
│   └── reportWebVitals.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd employee-training-todo
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to view the application.

## Troubleshooting

### "babel-jest" Dependency Error

If you see an error about `babel-jest` when running `npm start`, follow these steps:

1. Delete `package-lock.json` (not `package.json`!) and/or `yarn.lock` in your project folder.
2. Delete the `node_modules` folder in your project folder.
3. Remove `"babel-jest"` from `dependencies` and/or `devDependencies` in your `package.json` file.
4. Run `npm install` to reinstall dependencies.

If the problem persists, you can bypass the check by adding the following line to a new `.env` file in your project root:

```
SKIP_PREFLIGHT_CHECK=true
```

This will disable the preflight check, but use with caution as it may hide other issues.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
