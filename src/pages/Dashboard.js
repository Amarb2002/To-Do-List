import React, { useState, useEffect } from 'react';
import './dashboard.css';

// Key for localStorage
const STORAGE_KEY = 'employee-tasks';

const defaultTasks = [
    { id: 1, employerName: "John Doe", status: "Pending", dueDate: "2024-07-05T10:00" },
    { id: 2, employerName: "Jane Smith", status: "Completed", dueDate: "2024-07-06T17:00" },
    { id: 3, employerName: "Alex Brown", status: "Pending", dueDate: "2024-06-30T12:00" }
];

function isDueCrossed(dueDate, status) {
    if (status === "Completed") return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
}

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        employerName: '',
        task: '',
        startDate: '',
        dueDate: '',
        status: 'Pending', // always default to Pending
        active: true
    });
    const [showOverduePopup, setShowOverduePopup] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setTasks(JSON.parse(stored));
        } else {
            setTasks(defaultTasks);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks]);

    const totalTasks = tasks.length;
    const totalPending = tasks.filter(t => t.status === "Pending").length;
    const totalOverdue = tasks.filter(t => isDueCrossed(t.dueDate, t.status)).length;

    const handleOpenForm = () => {
        setForm({
            employerName: '',
            task: '',
            startDate: '',
            dueDate: '',
            status: 'Pending', // always default to Pending
            active: true
        });
        setShowForm(true);
    };

    const handleCloseForm = () => setShowForm(false);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "employerName") {
            // Only allow alphabets and spaces
            const alphaValue = value.replace(/[^a-zA-Z\s]/g, '');
            setForm(f => ({
                ...f,
                [name]: alphaValue
            }));
        } else {
            setForm(f => ({
                ...f,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const validateForm = (form) => {
        const errors = {};
        const now = new Date();
        if (!form.employerName.trim()) {
            errors.employerName = "Employer name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(form.employerName.trim())) {
            errors.employerName = "Employer name must contain only letters and spaces.";
        }
        if (!form.task.trim()) errors.task = "Task name is required.";
        if (!form.startDate) {
            errors.startDate = "Start date is required.";
        } else if (new Date(form.startDate) < now) {
            errors.startDate = "Start date cannot be before current date/time.";
        }
        if (!form.dueDate) {
            errors.dueDate = "Due date is required.";
        } else if (new Date(form.dueDate) < now) {
            errors.dueDate = "Due date cannot be before current date/time.";
        }
        if (
            form.startDate &&
            form.dueDate &&
            new Date(form.dueDate) < new Date(form.startDate)
        ) {
            errors.dueDate = "Due date cannot be before start date.";
        }
        return errors;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(form);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        const newTask = {
            id: Date.now(),
            ...form,
            status: 'Pending' // always set to Pending
        };
        setTasks([...tasks, newTask]);
        setShowForm(false);
        setFormErrors({});
    };

    const overdueTasks = tasks.filter(t => isDueCrossed(t.dueDate, t.status));

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2>Dashboard Overview</h2>
                <button className="dashboard-btn" onClick={handleOpenForm}>
                    <span className="icon" role="img" aria-label="add">➕</span>
                    Add Task
                </button>
            </div>
            <div className="dashboard-cards">
                <div className="dashboard-card total">
                    <span className="icon" role="img" aria-label="tasks">🗂️</span>
                    <strong>Total Tasks</strong>
                    <div className="dashboard-value">{totalTasks}</div>
                </div>
                <div className="dashboard-card pending">
                    <span className="icon" role="img" aria-label="pending">⏳</span>
                    <strong>Pending Tasks</strong>
                    <div className="dashboard-value">{totalPending}</div>
                </div>
                <div className="dashboard-card overdue">
                    <span className="icon" role="img" aria-label="overdue">⚠️</span>
                    <strong>Overdue Tasks</strong>
                    <div className="dashboard-value" style={{ color: '#e53935' }}>{totalOverdue}</div>
                </div>
            </div>
            <p>Go to <b>All</b> section to view and manage all tasks.</p>

            {/* Show Overdue Tasks button if there are multiple overdue tasks */}
            {overdueTasks.length > 0 && (
                <button
                    className="dashboard-btn"
                    style={{ margin: '16px 0', background: '#e53935', color: '#fff' }}
                    onClick={() => setShowOverduePopup(true)}
                >
                    <span className="icon" role="img" aria-label="overdue">⚠️</span>
                    View Overdue Tasks ({overdueTasks.length})
                </button>
            )}

            {/* Overdue Tasks Popup */}
            {showOverduePopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1100
                    }}
                >
                    <div
                        style={{
                            background: '#ffebee',
                            border: '2px solid #e53935',
                            borderRadius: 14,
                            boxShadow: '0 8px 32px rgba(229,57,53,0.18)',
                            padding: '32px 24px 24px 24px',
                            minWidth: 320,
                            maxWidth: 420,
                            width: '90%',
                            position: 'relative'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setShowOverduePopup(false)}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 14,
                                background: 'none',
                                border: 'none',
                                fontSize: 22,
                                cursor: 'pointer'
                            }}
                            aria-label="Close"
                        >✖️</button>
                        <h3 style={{ color: "#e53935", marginTop: 0, marginBottom: 18, textAlign: 'center' }}>
                            <span className="icon" role="img" aria-label="overdue">⚠️</span>
                            Overdue Tasks ({overdueTasks.length})
                        </h3>
                        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                            {overdueTasks.slice().reverse().map(task => (
                                <li key={task.id} style={{
                                    marginBottom: 14,
                                    padding: 10,
                                    borderRadius: 7,
                                    background: "#fff",
                                    boxShadow: "0 2px 8px rgba(229,57,53,0.06)"
                                }}>
                                    <b>{task.employerName}</b> - {task.task ? task.task : ""}
                                    <br />
                                    <span style={{ color: "#e53935" }}>
                                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {showForm && (
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
                        onSubmit={handleFormSubmit}
                        className="dashboard-add-task-form"
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: '36px 32px 28px 32px',
                            minWidth: 340,
                            width: '50%',
                            maxWidth: 600,
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
                            onClick={handleCloseForm}
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
                            <span className="icon" role="img" aria-label="add">📝</span>
                            Add New Task
                        </h3>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Employer Name*<br />
                                <input
                                    type="text"
                                    name="employerName"
                                    value={form.employerName}
                                    onChange={handleFormChange}
                                    required
                                    className="dashboard-input-narrow"
                                    style={{
                                        width: '100%',
                                        maxWidth: 760,
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
                                {formErrors.employerName && (
                                    <span style={{ color: "#e53935", fontSize: "0.95em" }}>{formErrors.employerName}</span>
                                )}
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Task Name*<br />
                                <input
                                    type="text"
                                    name="task"
                                    value={form.task}
                                    onChange={handleFormChange}
                                    required
                                    className="dashboard-input-narrow"
                                    style={{
                                        width: '100%',
                                        maxWidth: 760,
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                    placeholder="Enter task name"
                                />
                                {formErrors.task && (
                                    <span style={{ color: "#e53935", fontSize: "0.95em" }}>{formErrors.task}</span>
                                )}
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Start Date*<br />
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleFormChange}
                                    required
                                    className="dashboard-input-narrow"
                                    style={{
                                        width: '100%',
                                        maxWidth: 760,
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                />
                                {formErrors.startDate && (
                                    <span style={{ color: "#e53935", fontSize: "0.95em" }}>{formErrors.startDate}</span>
                                )}
                            </label>
                            <label style={{ width: '100%', textAlign: 'left' }}>
                                Due Date*<br />
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleFormChange}
                                    required
                                    className="dashboard-input-narrow"
                                    style={{
                                        width: '100%',
                                        maxWidth: 760,
                                        padding: 10,
                                        borderRadius: 8,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: '1rem',
                                        background: '#f9f9f9',
                                        marginTop: 4
                                    }}
                                />
                                {formErrors.dueDate && (
                                    <span style={{ color: "#e53935", fontSize: "0.95em" }}>{formErrors.dueDate}</span>
                                )}
                            </label>
                            <div style={{ width: '100%', textAlign: 'left', margin: '8px 0' }}>
                                <span style={{ marginRight: 10 }}>Active Status:</span>
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, active: true }))}
                                    style={{
                                        background: form.active ? '#1976d2' : '#e0e0e0',
                                        color: form.active ? '#fff' : '#333',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '8px 18px',
                                        marginRight: 8,
                                        cursor: 'pointer',
                                        fontWeight: form.active ? 600 : 400
                                    }}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, active: false }))}
                                    style={{
                                        background: !form.active ? '#e53935' : '#e0e0e0',
                                        color: !form.active ? '#fff' : '#333',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '8px 18px',
                                        cursor: 'pointer',
                                        fontWeight: !form.active ? 600 : 400
                                    }}
                                >
                                    Inactive
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="dashboard-btn" style={{
                            width: '100%',
                            marginTop: 10,
                            fontSize: '1.1rem',
                            padding: '12px 0'
                        }}>
                            <span className="icon" role="img" aria-label="add">➕</span>
                            Add Task
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Dashboard;