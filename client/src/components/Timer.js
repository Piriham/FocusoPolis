import React, { useState, useEffect } from 'react';

const Timer = ({ onTimerComplete, sessionLength }) => {
    const [time, setTime] = useState(sessionLength * 60);
    const [isRunning, setIsRunning] = useState(false);

    const logFocusSession = async (duration, status = 'completed') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('https://focusopolis.onrender.com/api/focus-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ duration, status })
            });

            if (response.ok) {
                console.log('Focus session logged successfully');
            } else {
                console.error('Failed to log focus session');
            }
        } catch (error) {
            console.error('Error logging focus session:', error);
        }
    };

    const startTimer = () => {
        setIsRunning(true);
    };

    const resetTimer = () => {
        setTime(sessionLength * 60);
        setIsRunning(false);
    };

    useEffect(() => {
        setTime(sessionLength * 60);
    }, [sessionLength]);

    useEffect(() => {
        if (isRunning) {
            const timer = setTimeout(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        setIsRunning(false);
                        onTimerComplete(sessionLength);
                        // Log the completed focus session
                        logFocusSession(sessionLength, 'completed');
                        return sessionLength * 60;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isRunning, time, sessionLength, onTimerComplete]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div className="timer-container">
            <div className="timer-display">
                <span>{minutes.toString().padStart(2, '0')}</span>:
                <span>{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="timer-controls">
                <button onClick={startTimer} disabled={isRunning}>Start</button>
                <button onClick={resetTimer} disabled={!isRunning}>Reset</button>
            </div>
        </div>
    );
};

export default Timer;
