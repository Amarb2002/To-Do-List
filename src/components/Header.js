import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

function Header() {
    const [navOpen, setNavOpen] = useState(false);
    const location = useLocation();

    const handleNavToggle = () => setNavOpen(!navOpen);

    const handleLoginClick = () => {
        alert('This page is under maintenance');
    };

    return (
        <header className="header">
            <div className="logo">
                <span className="icon" role="img" aria-label="logo">📋</span>
                <h1>Employee Training Tracker</h1>
            </div>
            <button
                className="nav-toggle"
                aria-label="Toggle navigation"
                onClick={handleNavToggle}
            >
                <span style={{ fontSize: '1.7rem' }}>☰</span>
            </button>
            <nav
                className={`nav${navOpen ? ' nav-open' : ''}`}
            >
                <Link
                    to="/"
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={() => setNavOpen(false)}
                >
                    <span className="icon" role="img" aria-label="dashboard">🏠</span> Dashboard
                </Link>
                <Link
                    to="/all"
                    className={location.pathname === '/all' ? 'active' : ''}
                    onClick={() => setNavOpen(false)}
                >
                    <span className="icon" role="img" aria-label="all tasks">🗂️</span> All
                </Link>
                <Link
                    to="/completed-tasks"
                    className={location.pathname === '/completed-tasks' ? 'active' : ''}
                    onClick={() => setNavOpen(false)}
                >
                    <span className="icon" role="img" aria-label="completed">✅</span> Completed Tasks
                </Link>
                <button
                    type="button"
                    className="login-btn"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        padding: '8px 14px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                    onClick={handleLoginClick}
                >
                    <span className="icon" role="img" aria-label="login">🔑</span> Login
                </button>
            </nav>
        </header>
    );
}

export default Header;