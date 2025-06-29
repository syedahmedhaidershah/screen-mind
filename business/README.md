# Business Configuration

This directory contains the business logic configuration for ScreenMind.

## Files

### `config.json`
**Purpose**: Central configuration file for all app settings, UI text, and feature flags

## Configuration Structure

### Timer Settings
```json
{
  "timer": {
    "workSessionDuration": 1200,      // 20 minutes in seconds
    "breakDuration": 20,              // 20 seconds
    "interval": 1000,                 // Timer update interval (1 second)
    "progressBarMax": 1200            // Progress bar maximum value
  }
}
```

### Time Settings
```json
{
  "time": {
    "morningThreshold": 12,           // Hour when morning check-in stops
    "timeFormat": {
      "padStart": 2,                  // Zero-padding for time display
      "padChar": "0"                  // Character to pad with
    }
  }
}
```

### UI Text Configuration
```json
{
  "ui": {
    "text": {
      "appTitle": "ScreenMind",
      "moodCheckTitle": "How are you today?",
      "breakReminderTitle": "Time for a break!",
      "timerLabel": "20-20-20 Timer",
      "footerMessage": "Take care of your eyes! 👁️‍🗨️"
    },
    "buttons": {
      "start": "Start",
      "pause": "Pause", 
      "reset": "Reset",
      "takeBreak": "Take Break",
      "skipBreak": "Skip Break",
      "deepBreath": "Deep Breath",
      "stretch": "Stretch",
      "drinkWater": "Drink Water"
    },
    "moodOptions": {
      "great": {
        "text": "😊 Great",
        "emoji": "😊"
      },
      "okay": {
        "text": "😐 Okay", 
        "emoji": "😐"
      },
      "notGreat": {
        "text": "😞 Not Great",
        "emoji": "😞"
      }
    },
    "stats": {
      "breaksTaken": "Breaks: {count}",
      "streak": "Streak: {count}"
    }
  }
}
```

### Feature Flags
```json
{
  "features": {
    "moodCheck": {
      "enabled": true
    },
    "quickActions": {
      "enabled": true
    }
  }
}
```

### Default Values
```json
{
  "defaults": {
    "timer": {
      "currentTime": 0,
      "breakCountdown": 20
    },
    "moodData": {
      "morning": "",
      "sleep": "",
      "anxiety": "",
      "energy": ""
    },
    "stats": {
      "breaksTaken": 0,
      "breaksSkipped": 0,
      "totalScreenTime": 0,
      "streak": 0
    }
  }
}
```

## Usage

The configuration is imported in `src/App.tsx`:

```typescript
import config from "../business/config.json";
```

All app settings, text, and behavior are controlled through this file, making it easy to:
- Customize timer durations
- Change UI text and labels
- Enable/disable features
- Modify default values
- Localize the application

## Customization

### Changing Timer Duration
To change from 20-20-20 to 25-5-25 (25 minutes work, 5 minutes break):
```json
{
  "timer": {
    "workSessionDuration": 1500,      // 25 minutes
    "breakDuration": 300,             // 5 minutes
    "progressBarMax": 1500
  }
}
```

### Disabling Features
To disable mood check-ins:
```json
{
  "features": {
    "moodCheck": {
      "enabled": false
    }
  }
}
```

### Customizing Text
To change app title:
```json
{
  "ui": {
    "text": {
      "appTitle": "My Eye Care App"
    }
  }
}
```

## Validation

The configuration should be validated to ensure:
- All required fields are present
- Timer values are positive integers
- Feature flags are boolean values
- Text fields are non-empty strings

## Localization

For multi-language support, create separate config files:
- `config.en.json` (English)
- `config.es.json` (Spanish)
- `config.fr.json` (French)

Then import the appropriate file based on system locale. 