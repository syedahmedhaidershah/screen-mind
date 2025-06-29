# AppleScript Scripts

This directory contains AppleScript files used by ScreenMind for system integration on macOS.

## Files

### `break_notification.scpt`
**Purpose**: Main notification and app foregrounding script

**Functionality**:
- Plays system sounds (submarine sound with glass fallback)
- Shows system notification with break reminder
- Attempts to bring ScreenMind app to foreground using multiple methods
- Returns "notification_sent" on success

**Usage**: Called by Tauri backend when break time is triggered

**Methods for App Foregrounding**:
1. Direct app activation: `tell application "ScreenMind" to activate`
2. Process name detection: Tries `screen-mind-app`, `ScreenMind`, `screen_mind_app`
3. Window title detection: Finds windows containing "ScreenMind"

### `test_notification.scpt`
**Purpose**: Minimal test script for debugging notification issues

**Functionality**:
- Plays submarine sound
- Shows test notification
- Used for isolating notification problems

**Usage**: Run manually with `osascript src-tauri/scripts/test_notification.scpt`

## Development Notes

### Error Handling
- All foreground methods are wrapped in individual `try` blocks
- Notification and sound always execute first, regardless of foreground success
- Script continues even if some methods fail

### Process Names
In development, the app process name is typically `screen-mind-app`.
In production, it may be `ScreenMind` or the bundle identifier.

### Testing
To test scripts manually:
```bash
# Test main notification script
osascript src-tauri/scripts/break_notification.scpt

# Test minimal notification
osascript src-tauri/scripts/test_notification.scpt
```

### Troubleshooting
- If notifications don't appear, check macOS notification permissions
- If app doesn't come to foreground, check process name in Activity Monitor
- Script logs available processes for debugging (in development)

## Integration with Tauri

The scripts are called from `src-tauri/src/lib.rs` using the `send_break_notification` command:

```rust
#[tauri::command]
fn send_break_notification() -> Result<String, String> {
    // Execute the OSA script
    let output = Command::new("osascript")
        .arg(script_path)
        .output()?;
    
    // Return result
    Ok(String::from_utf8(output.stdout)?.trim().to_string())
}
```

## Bundle Configuration

Scripts are included in the app bundle via `tauri.conf.json`:
```json
{
  "bundle": {
    "resources": [
      "scripts/*"
    ]
  }
}
``` 