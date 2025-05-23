import React, { useState, useEffect } from 'react';
import './todo.css';

const STORAGE_KEY = 'employee-tasks';

function CompletedTasks() {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const allTasks = JSON.parse(stored);
            // Support both {completed: true} and {status: "Completed"}
            const filtered = allTasks.filter(
                t => t.completed === true || t.status === "Completed"
            );
            setCompletedTasks(filtered);
        } else {
            setCompletedTasks([]);
        }
    }, []);

    return (
        <div className="dashboard-container">
            <h2>
                <span className="icon" role="img" aria-label="completed">✅</span>
                Completed Training Tasks
            </h2>
            <div>
                {completedTasks.length === 0 ? (
                    <p>No completed tasks yet.</p>
                ) : (
                    <ul className="completed-tasks-list" style={{ padding: 0, listStyle: "none" }}>
                        {completedTasks.map(task => (
                            <li key={task.id} className="completed-task-details" style={{
                                background: "#e8f5e9",
                                marginBottom: 16,
                                padding: 16,
                                borderRadius: 8,
                                boxShadow: "0 2px 8px rgba(79,140,255,0.06)"
                            }}>
                                <h3 style={{ margin: 0, color: "#388e3c" }}>
                                    <span className="icon" role="img" aria-label="check">✅</span>
                                    {task.title || task.text || task.employerName}
                                </h3>
                                {task.description && <p><span className="icon" role="img" aria-label="desc">📝</span><b>Description:</b> {task.description}</p>}
                                {task.employerName && <p><span className="icon" role="img" aria-label="employee">👤</span><b>Employee:</b> {task.employerName}</p>}
                                {task.dueDate && (
                                    <p>
                                        <span className="icon" role="img" aria-label="due">📅</span>
                                        <b>Due Date:</b> {new Date(task.dueDate).toLocaleString()}
                                    </p>
                                )}
                                {typeof task.completed !== "undefined" && (
                                    <p>
                                        <span className="icon" role="img" aria-label="status">📌</span>
                                        <b>Status:</b> {task.completed ? "Completed" : "Pending"}
                                    </p>
                                )}

                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default CompletedTasks;