import React from 'react';
import './todo.css';

function TodoItem({ task, onComplete, onDelete }) {
    return (
        <div className="todo-item" style={{ boxShadow: '0 2px 8px rgba(79,140,255,0.06)' }}>
            <div className="todo-details">
                <h3 className={task.completed ? "completed" : ""}>{task.title || task.text}</h3>
                {task.description && <p>{task.description}</p>}
            </div>
            <div className="todo-actions">
                {onComplete && (
                    <button onClick={() => onComplete(task.id)} disabled={task.completed}>
                        <span className="icon" role="img" aria-label="complete">{task.completed ? "✅" : "✔️"}</span>
                        {task.completed ? "Completed" : "Mark as Completed"}
                    </button>
                )}
                {onDelete && (
                    <button onClick={() => onDelete(task.id)}>
                        <span className="icon" role="img" aria-label="delete">🗑️</span>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default TodoItem;