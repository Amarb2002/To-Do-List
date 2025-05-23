import React, { useState } from 'react';
import TodoItem from './TodoItem';
import './todo.css';

function TodoList({
    tasks: externalTasks,
    setTasks: setExternalTasks,
    handleToggleTask,
    handleRemoveTask,
    hideHeader
}) {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');

    // Use external state if provided (for dashboard), else internal state
    const tasksToUse = externalTasks !== undefined ? externalTasks : tasks;
    const setTasksToUse = setExternalTasks !== undefined ? setExternalTasks : setTasks;
    const toggleTask = handleToggleTask !== undefined ? handleToggleTask : (id) => {
        setTasksToUse(tasksToUse.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };
    const removeTask = handleRemoveTask !== undefined ? handleRemoveTask : (id) => {
        setTasksToUse(tasksToUse.filter(task => task.id !== id));
    };

    const handleAddTask = () => {
        if (taskInput.trim()) {
            const newTask = {
                id: Date.now(),
                text: taskInput,
                completed: false,
            };
            setTasksToUse([...tasksToUse, newTask]);
            setTaskInput('');
        }
    };

    return (
        <div className="todo-list">
            {!hideHeader && <h2>Employee Training Tasks</h2>}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Add a new task"
                />
                <button onClick={handleAddTask}>
                    <span className="icon" role="img" aria-label="add">➕</span>
                    Add Task
                </button>
            </div>
            <ul>
                {tasksToUse.length === 0 ? (
                    <li>No tasks yet.</li>
                ) : (
                    tasksToUse.map(task => (
                        <TodoItem
                            key={task.id}
                            task={task}
                            onComplete={toggleTask}
                            onDelete={removeTask}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}

export default TodoList;