import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import All from './pages/All';
import CompletedTasks from './pages/CompletedTasks';
import Login from './pages/Login';
import './styles/header.css';
import './styles/footer.css';
import './styles/todo.css';
import './styles/dashboard.css';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/all" element={<All />} />
                <Route path="/completed-tasks" element={<CompletedTasks />} />
                <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;