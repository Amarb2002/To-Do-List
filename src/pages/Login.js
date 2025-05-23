import React from 'react';
import './login.css';

function Login() {
    const handleClick = () => {
        alert('This page is under maintenance');
    };

    return (
        <div className="login-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button className="login-btn" onClick={handleClick}>
                <span className="icon" role="img" aria-label="maintenance">🚧</span>
                Login
            </button>
        </div>
    );
}

export default Login;