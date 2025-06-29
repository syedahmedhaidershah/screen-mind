-- ScreenMind Break Notification Script
-- This script plays sound, shows notification, and brings the app to foreground

on run
    -- Always play sound and show notification first
    try
        do shell script "afplay /System/Library/Sounds/Submarine.aiff"
    on error
        try
            do shell script "afplay /System/Library/Sounds/Glass.aiff"
        end try
    end try

    display notification "Time for break! Look 20 feet away for 20 seconds." with title "🕒 ScreenMind Break Reminder"

    -- Now, try to bring app to foreground using multiple methods, each in its own try block
    try
        tell application "ScreenMind" to activate
    end try
    try
        tell application "System Events"
            set processNames to {"screen-mind-app", "ScreenMind", "screen_mind_app"}
            repeat with processName in processNames
                try
                    tell process processName
                        set frontmost to true
                        exit repeat
                    end tell
                end try
            end repeat
        end tell
    end try
    try
        tell application "System Events"
            set windowList to windows of every process
            repeat with windowGroup in windowList
                repeat with windowItem in windowGroup
                    try
                        if name of windowItem contains "ScreenMind" then
                            set frontmost of (process of windowItem) to true
                            exit repeat
                        end if
                    end try
                end repeat
            end repeat
        end tell
    end try

    return "notification_sent"
end run 