on run
    try
        do shell script "afplay /System/Library/Sounds/Submarine.aiff"
    end try
    display notification "Test notification from ScreenMind script." with title "ScreenMind Test"
end run 