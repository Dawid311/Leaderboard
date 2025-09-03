'use client';
import { useState, useEffect } from 'react';
import { TimerSettings } from '../types';

interface CountdownTimerProps {
  timer: TimerSettings;
}

export default function CountdownTimer({ timer }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!timer.isActive) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(timer.endDate);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [timer.endDate, timer.isActive]);

  if (!timer.isActive) {
    return null;
  }

  return (
    <div className="timer-container">
      <h2>{timer.title}</h2>
      <p>{timer.description}</p>
      
      {isExpired ? (
        <div className="timer-expired">
          <h3>🎉 Contest beendet!</h3>
          <p>Die Preisauszahlung kann nun erfolgen.</p>
        </div>
      ) : (
        <div className="countdown">
          <div className="time-unit">
            <span className="time-number">{timeLeft.days}</span>
            <span className="time-label">Tage</span>
          </div>
          <div className="time-unit">
            <span className="time-number">{timeLeft.hours}</span>
            <span className="time-label">Stunden</span>
          </div>
          <div className="time-unit">
            <span className="time-number">{timeLeft.minutes}</span>
            <span className="time-label">Minuten</span>
          </div>
          <div className="time-unit">
            <span className="time-number">{timeLeft.seconds}</span>
            <span className="time-label">Sekunden</span>
          </div>
        </div>
      )}
    </div>
  );
}
