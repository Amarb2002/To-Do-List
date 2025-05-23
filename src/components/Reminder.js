import React, { useState } from 'react';

function Reminder({ task, onSetReminder }) {
    const [reminderTime, setReminderTime] = useState('');

    const handleSetReminder = () => {
        if (reminderTime) {
            onSetReminder(task.id, reminderTime);
            setReminderTime('');
        }
    };

    return (
        <div className="reminder-container">
            <h3>Set Reminder for: {task.name}</h3>
            <input
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
            />
            <button onClick={handleSetReminder}>Set Reminder</button>
        </div>
    );
}

export default Reminder;