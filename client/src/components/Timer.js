import React, { useState, useEffect } from 'react';

const Timer = ({ onTimerComplete }) => {
    const [time, setTime] = useState(1800); // 30 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = () => {
        setIsRunning(true);
    };

    const resetTimer = () => {
        setTime(1800);
        setIsRunning(false);
    };

    useEffect(() => {
        if (isRunning) {
            const timer = setTimeout(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        setIsRunning(false);
                        onTimerComplete();
                        return 1800;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isRunning, time]);

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
