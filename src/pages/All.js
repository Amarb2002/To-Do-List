import React, { useState, useEffect, useRef } from 'react';
import './all.css';

const STORAGE_KEY = 'employee-tasks';

function isOverdue(task) {
    if (task.status === "Completed" || task.completed === true) return false;
    if (task.active === false) return false; // Don't show overdue popup if inactive
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    return due < now;
}

function All() {
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormError, setEditFormError] = useState('');
    const shownOverdueIds = useRef(new Set());

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setTasks(JSON.parse(stored));
        }
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const updated = tasks.filter(t => t.id !== id);
            setTasks(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const handleToggleStatus = (id) => {
        const updated = tasks.map(t =>
            t.id === id
                ? {
                    ...t,
                    status: t.status === "Completed" || t.completed === true
                        ? "Pending"
                        : "Completed",
                    completed: t.status === "Completed" || t.completed === true
                        ? false
                        : true
                }
                : t
        );
        setTasks(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleEditClick = (task) => {
        setEditTask({ ...task });
        setShowEditForm(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditTask((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Validate employerName: only alphabets and spaces
        if (!editTask.employerName.trim()) {
            setEditFormError("Employer name is required.");
            return;
        }
        if (!/^[a-zA-Z\s]+$/.test(editTask.employerName.trim())) {
            setEditFormError("Employer name must contain only letters and spaces.");
            return;
        }
        setEditFormError('');
        setTasks((prev) => {
            const updated = prev.map((t) => t.id === editTask.id ? editTask : t);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
        setShowEditForm(false);
        setEditTask(null);
    };

    const handleEditClose = () => {
        setShowEditForm(false);
        setEditTask(null);
    };

    const handleToggleActive = (id) => {
        const updated = tasks.map(t =>
            t.id === id
                ? { ...t, active: t.active === undefined ? false : !t.active }
                : t
        );
        setTasks(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <div className="all-container">
            <div className="all-header">
                <span className="icon" role="img" aria-label="all">🗂️</span>
                <h2>All Training Tasks</h2>
            </div>
            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <div className="all-table-wrapper">
                    <table className="all-table">
                        <thead>
                            <tr>
                                <th>Employer Name</th>
                                <th>Task Name</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Active/Inactive</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.slice().reverse().map(task => (
                                <tr key={task.id}>
                                    <td data-label="Employer Name">{task.employerName || '-'}</td>
                                    <td data-label="Task Name">{task.task || task.title || task.text || '-'}</td>
                                    <td data-label="Start Date">{task.startDate ? new Date(task.startDate).toLocaleString() : '-'}</td>
                                    <td data-label="Due Date">{task.dueDate ? new Date(task.dueDate).toLocaleString() : '-'}</td>
                                    <td data-label="Active/Inactive">
                                        <button
                                            className="all-btn status"
                                            style={{
                                                background: task.active === false ? '#bdbdbd' : undefined
                                            }}
                                            onClick={() => handleToggleActive(task.id)}
                                        >
                                            {task.active === false ? 'Inactive' : 'Active'}
                                        </button>
                                    </td>
                                    <td data-label="Status">
                                        {task.status === "Completed" || task.completed === true ? (
                                            <span className="all-status completed">Completed</span>
                                        ) : (
                                            <span className={`all-status${isOverdue(task) ? ' overdue' : ' pending'}`}>
                                                {isOverdue(task) ? 'Overdue' : 'Pending'}
                                            </span>
                                        )}
                                    </td>
                                    <td data-label="Action">
                                        <button className="all-btn edit" title="Edit" onClick={() => handleEditClick(task)}>
                                            ✏️
                                        </button>
                                        <button className="all-btn delete" title="Delete" onClick={() => handleDelete(task.id)}>
                                            🗑️
                                        </button>
                                        <button
                                            className="all-btn status"
                                            title={task.status === "Completed" || task.completed === true ? "Mark as Pending" : "Mark as Completed"}
                                            onClick={() => handleToggleStatus(task.id)}
                                        >
                                            {task.status === "Completed" || task.completed === true ? "Mark Pending" : "Mark Completed"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            {showEditForm && editTask && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    <form
                        onSubmit={handleEditSubmit}
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: '36px 32px 28px 32px',
                            minWidth: 320,
                            width: '90%',
                            maxWidth: 400,
                            boxShadow: '0 8px 32px rgba(79,140,255,0.18)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 18
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleEditClose}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 16,
                                background: 'none',
                                border: 'none',
                                fontSize: 22,
                                cursor: 'pointer'
                            }}
                            aria-label="Close"
                        >✖️</button>
                        <h3 style={{ marginTop: 0, color: "#1976d2", textAlign: 'center', marginBottom: 8 }}>
                            <span className="icon" role="img" aria-label="edit">✏️</span>
                            Edit Task
                        </h3>
                        {editFormError && (
                            <div style={{ color: "#e53935", marginBottom: 8, textAlign: "center" }}>
                                {editFormError}
                            </div>
                        )}
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Employer Name*<br />
                                <input
                                    type="text"
                                    name="employerName"
                                    value={editTask.employerName}
                                    onChange={handleEditChange}
                                    required
                                    style={{
                                        width: '95%',
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                    placeholder="Enter employer name"
                                    pattern="[A-Za-z\s]+"
                                    title="Only alphabets and spaces allowed"
                                />
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Task Name*<br />
                                <input
                                    type="text"
                                    name="task"
                                    value={editTask.task}
                                    onChange={handleEditChange}
                                    required
                                    style={{
                                        width: '95%',
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                    placeholder="Enter task name"
                                />
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Start Date*<br />
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={editTask.startDate}
                                    onChange={handleEditChange}
                                    required
                                    style={{
                                        width: '95%',
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                />
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Due Date*<br />
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={editTask.dueDate}
                                    onChange={handleEditChange}
                                    required
                                    style={{
                                        width: '95%',
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                />
                            </label>
                            <label style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={editTask.active}
                                    onChange={handleEditChange}
                                    style={{ marginRight: 6 }}
                                />
                                Active
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Status<br />
                                <select
                                    name="status"
                                    value={editTask.status}
                                    onChange={handleEditChange}
                                    style={{
                                        width: '100%',
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </label>
                        </div>
                        <button type="submit" className="dashboard-btn" style={{
                            width: '100%',
                            marginTop: 10,
                            fontSize: '1.1rem',
                            padding: '12px 0'
                        }}>
                            <span className="icon" role="img" aria-label="edit">✏️</span>
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default All;
