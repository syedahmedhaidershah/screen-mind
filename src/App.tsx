import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import config from "../business/config.json";
import "./App.css";

interface MoodData {
  morning: string;
  sleep: string;
  anxiety: string;
  energy: string;
}

interface SessionStats {
  breaksTaken: number;
  breaksSkipped: number;
  totalScreenTime: number;
  streak: number;
}

function App() {
  const [currentTime, setCurrentTime] = useState(config.defaults.timer.currentTime);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState(config.defaults.timer.breakCountdown);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [moodData, setMoodData] = useState<MoodData>(config.defaults.moodData);
  const [stats, setStats] = useState<SessionStats>(config.defaults.stats);
  const [isActive, setIsActive] = useState(false);
  const [waitingForAcknowledgment, setWaitingForAcknowledgment] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // Timer effect for 20-20-20 rule
  useEffect(() => {
    const timer = setInterval(() => {
      if (isActive && !isBreakTime) {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= config.timer.workSessionDuration) {
            setIsBreakTime(true);
            setBreakCountdown(config.timer.breakDuration);
            return 0;
          }
          return newTime;
        });
      }
    }, config.timer.interval);

    return () => clearInterval(timer);
  }, [isActive, isBreakTime]);

  // Break countdown effect
  useEffect(() => {
    if (isBreakTime && breakCountdown > 0 && !waitingForAcknowledgment) {
      const countdownTimer = setInterval(() => {
        setBreakCountdown(prev => {
          if (prev <= 1) {
            // Don't automatically end break - wait for user input
            // Just stop the countdown and wait for user to take action
            return 0;
          }
          return prev - 1;
        });
      }, config.timer.interval);

      return () => clearInterval(countdownTimer);
    }
  }, [isBreakTime, breakCountdown, waitingForAcknowledgment]);

  // OSA notification effect - trigger when break time starts
  useEffect(() => {
    if (isBreakTime && breakCountdown === config.timer.breakDuration && !waitingForAcknowledgment && !notificationSent) {
      // Set waiting state to pause countdown
      setWaitingForAcknowledgment(true);
      setNotificationSent(true); // Mark notification as sent for this break session
      
      // Call the OSA script to show notification with sound and bring app to foreground
      invoke("send_break_notification")
        .then((response: unknown) => {
          const responseStr = String(response);
          setWaitingForAcknowledgment(false); // Clear waiting state
          
          if (responseStr === "notification_sent") {
            // Notification sent successfully, start the actual break countdown
            setBreakCountdown(config.timer.breakDuration);
          } else {
            // Fallback if notification failed
            console.error("Unexpected response from OSA script:", responseStr);
            setBreakCountdown(config.timer.breakDuration);
          }
        })
        .catch((error) => {
          console.error("Failed to send break notification:", error);
          setWaitingForAcknowledgment(false); // Clear waiting state
          // Fallback to default break behavior
          setBreakCountdown(config.timer.breakDuration);
        });
    }
  }, [isBreakTime, breakCountdown, waitingForAcknowledgment, notificationSent]);

  // Check if it's morning (first launch of the day)
  useEffect(() => {
    const now = new Date();
    const isMorning = now.getHours() < config.time.morningThreshold;
    if (isMorning && !moodData.morning && config.features.moodCheck.enabled) {
      setShowMoodCheck(true);
    }
  }, [moodData.morning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(config.time.timeFormat.padStart, config.time.timeFormat.padChar)}:${secs.toString().padStart(config.time.timeFormat.padStart, config.time.timeFormat.padChar)}`;
  };

  const handleMoodResponse = (type: keyof MoodData, value: string) => {
    setMoodData(prev => ({ ...prev, [type]: value }));
    if (type === 'morning') {
      setShowMoodCheck(false);
      setIsActive(true);
    }
  };

  const skipBreak = () => {
    setIsBreakTime(false);
    setBreakCountdown(config.timer.breakDuration);
    setNotificationSent(false); // Reset notification flag for next break
    setStats(prev => ({ ...prev, breaksSkipped: prev.breaksSkipped + 1 }));
  };

  const takeBreak = () => {
    setIsBreakTime(false);
    setBreakCountdown(config.timer.breakDuration);
    setNotificationSent(false); // Reset notification flag for next break
    setIsActive(false); // Pause the timer
    setCurrentTime(0); // Reset timer to 0
    setStats(prev => ({ ...prev, breaksTaken: prev.breaksTaken + 1 }));
  };

  return (
    <div className="app">
      {showMoodCheck ? (
        <div className="mood-check">
          <h2>{config.ui.text.moodCheckTitle}</h2>
          <div className="mood-buttons">
            <button onClick={() => handleMoodResponse('morning', config.ui.moodOptions.great.emoji)}>
              {config.ui.moodOptions.great.text}
            </button>
            <button onClick={() => handleMoodResponse('morning', config.ui.moodOptions.okay.emoji)}>
              {config.ui.moodOptions.okay.text}
            </button>
            <button onClick={() => handleMoodResponse('morning', config.ui.moodOptions.notGreat.emoji)}>
              {config.ui.moodOptions.notGreat.text}
            </button>
          </div>
        </div>
      ) : (
        <div className="main-interface">
          <div className="header">
            <h1>{config.ui.text.appTitle}</h1>
            <div className="stats">
              <span>{config.ui.text.stats.breaksTaken.replace('{count}', stats.breaksTaken.toString())}</span>
              <span>{config.ui.text.stats.streak.replace('{count}', stats.streak.toString())}</span>
            </div>
          </div>

          {isBreakTime ? (
            <div className="break-reminder">
              <h2>{config.ui.text.breakReminderTitle}</h2>
              {waitingForAcknowledgment ? (
                <div className="waiting-acknowledgment">
                  <p>Waiting for your response...</p>
                  <div className="loading-spinner"></div>
                  <div className="fallback-actions">
                    <p className="fallback-text">If no dialog appeared, click below:</p>
                    <div className="break-actions">
                      <button 
                        onClick={() => {
                          setWaitingForAcknowledgment(false);
                          setIsBreakTime(false);
                          setBreakCountdown(config.timer.breakDuration);
                          setNotificationSent(false); // Reset notification flag for next break
                          setIsActive(false); // Pause the timer
                          setCurrentTime(0); // Reset timer to 0
                          setStats(prev => ({ ...prev, breaksTaken: prev.breaksTaken + 1 }));
                        }} 
                        className="primary"
                      >
                        {config.ui.text.buttons.takeBreak}
                      </button>
                      <button 
                        onClick={() => {
                          setWaitingForAcknowledgment(false);
                          setIsBreakTime(false);
                          setBreakCountdown(config.timer.breakDuration);
                          setNotificationSent(false); // Reset notification flag for next break
                          setIsActive(false); // Pause the timer
                          setCurrentTime(0); // Reset timer to 0
                          setStats(prev => ({ ...prev, breaksSkipped: prev.breaksSkipped + 1 }));
                        }} 
                        className="secondary"
                      >
                        {config.ui.text.buttons.skipBreak}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="countdown">
                    {breakCountdown > 0 ? `${breakCountdown}s` : "Break time is up!"}
                  </div>
                  <div className="break-actions">
                    <button onClick={takeBreak} className="primary">
                      {config.ui.text.buttons.takeBreak}
                    </button>
                    <button onClick={skipBreak} className="secondary">
                      {config.ui.text.buttons.skipBreak}
                    </button>
                  </div>
                  {config.features.quickActions.enabled && (
                    <div className="quick-actions">
                      <button>{config.ui.text.buttons.deepBreath}</button>
                      <button>{config.ui.text.buttons.stretch}</button>
                      <button>{config.ui.text.buttons.drinkWater}</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="timer-section">
              <div className="timer">
                <div className="time-display">{formatTime(currentTime)}</div>
                <div className="timer-label">{config.ui.text.timerLabel}</div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentTime / config.timer.progressBarMax) * 100}%` }}
                ></div>
              </div>
              <div className="controls">
                <button onClick={() => setIsActive(!isActive)}>
                  {isActive ? config.ui.text.buttons.pause : config.ui.text.buttons.start}
                </button>
                <button onClick={() => setCurrentTime(0)}>{config.ui.text.buttons.reset}</button>
              </div>
            </div>
          )}

          <div className="footer">
            <p>{config.ui.text.footerMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
