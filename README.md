# 👁️‍🗨️ ScreenMind

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS-blue.svg)](https://www.apple.com/macos/)
[![Framework: Tauri](https://img.shields.io/badge/Framework-Tauri-FFC131.svg)](https://tauri.app/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Language: Rust](https://img.shields.io/badge/Language-Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Package Manager: pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-orange?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-green.svg)](https://github.com/yourusername/ScreenMind/releases)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/yourusername/ScreenMind)

> A local AI wellness assistant designed to improve screen habits by tracking attention, reminding users to take breaks, and providing mood check-ins — all while prioritizing user privacy and offline functionality.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#installation)
- [Usage](#-usage)
- [Control Flows](#-control-flows--usage)
- [Technical Architecture](#️-technical-architecture)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [Privacy & Security](#-privacy--security)
- [License](#-license)

## 🎯 Features

- **20-20-20 Timer**: Enforces the eye health rule (every 20 minutes, look 20 feet away for 20 seconds)
- **Smart Break System**: Automatic break reminders with user acknowledgment
- **Daily Mood Check-ins**: Morning wellness assessments with emoji-based responses
- **Break Reminders**: System notifications with sound and app foregrounding
- **Local Data Storage**: All data stays on your device - no cloud, no accounts
- **Dark Mode Interface**: Designed to reduce eye strain
- **Privacy-First**: No webcam access unless explicitly opted in
- **Session Statistics**: Track breaks taken, skipped, and streaks
- **Customizable Configuration**: Easy-to-modify settings via JSON config
- **Offline Capable**: Works without internet connection

## 🚀 Quick Start

### Prerequisites

- **macOS**: 10.15 (Catalina) or later
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://rustup.rs/) (for Tauri backend)
- [pnpm](https://pnpm.io/) (recommended package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ScreenMind
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm tauri dev
   ```

### Building for Production

```bash
pnpm tauri build
```

The built application will be available in `src-tauri/target/release/bundle/`:
- **macOS**: `ScreenMind.app` (drag to Applications) or `ScreenMind_0.1.0_aarch64.dmg` (installer)

## 📱 Usage

### First Launch
1. Launch ScreenMind
2. If it's morning (before 12 PM), you'll see a mood check-in
3. Select your mood: 😊 Great, 😐 Okay, or 😞 Not Great
4. The 20-20-20 timer will automatically start

### Daily Use
1. **Timer**: The app tracks your screen time with a 20-minute countdown
2. **Break Reminders**: When the timer reaches 20 minutes, you'll get a notification
3. **Break Options**: Choose to "Take Break" (20 seconds) or "Skip Break"
4. **Statistics**: View your break history and streaks in real-time

### Quick Actions (Optional)
During breaks, you can access quick wellness actions:
- **Deep Breath**: Guided breathing reminder
- **Stretch**: Simple stretching suggestions
- **Drink Water**: Hydration reminder

## 🧭 Control Flows & Usage

### 1. Morning Mood Check-in Flow
```
App Launch → Check Time → Morning? → Show Mood Check → User Response → Start Timer
```

**Detailed Flow:**
1. **App Launch**: ScreenMind starts up
2. **Time Check**: App checks if current hour < morning threshold (configurable)
3. **Mood Display**: If morning, shows mood check-in with three options:
   - 😊 Great (emoji)
   - 😐 Okay (emoji) 
   - 😞 Not Great (emoji)
4. **User Response**: User clicks one of the mood buttons
5. **Timer Start**: App automatically starts the 20-20-20 timer
6. **Data Storage**: Mood response is stored locally

### 2. Main Timer Flow
```
Timer Active → Count Up → 20 Minutes? → Trigger Break → Wait for User Input
```

**Detailed Flow:**
1. **Timer Start**: User clicks "Start" button (or auto-starts after mood check)
2. **Count Up**: Timer counts up from 00:00 to 20:00 (20 minutes)
3. **Progress Bar**: Visual progress bar fills as time progresses
4. **Break Trigger**: When timer reaches 20 minutes:
   - Sets `isBreakTime = true`
   - Sets `breakCountdown = 20` (seconds)
   - Triggers notification system

### 3. Break Notification Flow
```
Break Triggered → OSA Script → Sound + Notification → App Foreground → User Acknowledgment
```

**Detailed Flow:**
1. **Break Trigger**: Timer reaches 20 minutes
2. **OSA Script Execution**: 
   - Plays submarine sound (with glass sound fallback)
   - Shows system notification: "🕒 ScreenMind Break Reminder"
   - Attempts to bring app to foreground using multiple methods
3. **App Foreground**: App window becomes active
4. **Waiting State**: App waits for user acknowledgment

### 4. Break Screen Flow
```
Break Screen → Countdown → User Action → Return to Timer
```

**Detailed Flow:**
1. **Break Screen Display**: Shows break reminder with countdown
2. **Countdown**: 20-second countdown (20s → 19s → ... → 0s)
3. **User Options**:
   - **Take Break**: Pauses timer, resets to 00:00, increments breaks taken
   - **Skip Break**: Pauses timer, resets to 00:00, increments breaks skipped
4. **Quick Actions** (if enabled):
   - Deep Breath button
   - Stretch button  
   - Drink Water button
5. **Return to Timer**: App returns to main timer screen with timer paused

### 5. Fallback Notification Flow
```
Notification Failed → Fallback Screen → Manual Action → Continue
```

**Detailed Flow:**
1. **Notification Failure**: If OSA script fails or no dialog appears
2. **Fallback Screen**: Shows "Waiting for your response..." with loading spinner
3. **Manual Buttons**: Provides manual Take Break/Skip Break buttons
4. **Continue**: User clicks button to proceed with break action

### 6. Timer Control Flow
```
Timer Controls → Start/Pause → Reset → Statistics Update
```

**Detailed Flow:**
1. **Start/Pause**: Toggle timer between running and paused states
2. **Reset**: Reset timer to 00:00 without affecting statistics
3. **Statistics**: Real-time display of:
   - Breaks taken count
   - Current streak count
   - Total screen time (planned)

## 🛠️ Technical Architecture

### Frontend (React + TypeScript)
- **State Management**: React hooks for timer, break, mood, and statistics
- **Timer Logic**: `useEffect` with `setInterval` for precise timing
- **Break System**: Complex state management for notification acknowledgment
- **UI Components**: Modern CSS with responsive design and glassmorphism effects

### Backend (Tauri + Rust)
- **OSA Integration**: AppleScript for system notifications and app foregrounding
- **Process Management**: Multiple methods to bring app to front
- **Error Handling**: Robust fallback mechanisms for notification failures
- **Native Performance**: Rust backend ensures fast, efficient operation

### Configuration System
- **JSON Config**: `business/config.json` for all app settings
- **Timer Settings**: Work session duration, break duration, intervals
- **UI Text**: Localizable strings for all interface elements
- **Feature Flags**: Enable/disable features like mood checks, quick actions

## 📦 Project Structure

```
ScreenMind/
├── src/                    # React frontend
│   ├── App.tsx            # Main application component with all flows
│   ├── App.css            # Modern styling with glassmorphism
│   ├── main.tsx           # React entry point
│   └── vite-env.d.ts      # Vite environment types
├── src-tauri/             # Tauri backend
│   ├── src/               # Rust source code
│   │   ├── lib.rs         # OSA script integration
│   │   └── main.rs        # Tauri app entry
│   ├── scripts/           # AppleScript files
│   │   ├── break_notification.scpt  # Notification and foreground logic
│   │   └── test_notification.scpt   # Testing script
│   ├── tauri.conf.json    # Tauri configuration
│   ├── Cargo.toml         # Rust dependencies
│   └── capabilities/      # Tauri security capabilities
├── business/              # Configuration
│   ├── config.json        # App settings, UI text, feature flags
│   └── README.md          # Configuration documentation
├── public/                # Static assets
│   ├── tauri.svg          # Tauri logo
│   └── vite.svg           # Vite logo
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── LICENSE                # MIT License
```

## ⚙️ Configuration

ScreenMind is highly configurable through the `business/config.json` file. See the [Configuration Documentation](business/README.md) for detailed information on:

- **Timer Settings**: Customize work session and break durations
- **UI Text**: Localize all interface text
- **Feature Flags**: Enable/disable specific features
- **Time Settings**: Configure morning check-in thresholds

### Quick Configuration Examples

**Change to 25-5-25 Timer (25 min work, 5 min break):**
```json
{
  "timer": {
    "workSessionDuration": 1500,
    "breakDuration": 300,
    "progressBarMax": 1500
  }
}
```

**Disable Mood Check-ins:**
```json
{
  "features": {
    "moodCheck": {
      "enabled": false
    }
  }
}
```

## 🛠️ Development

### Development Commands

```bash
# Start development server
pnpm tauri dev

# Build for production
pnpm tauri build

# Preview production build
pnpm preview

# Run Rust tests
cd src-tauri && cargo test
```

### Development Environment Setup

1. **Install Rust Toolchain**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Install Node.js Dependencies**
   ```bash
   pnpm install
   ```

3. **Install Tauri CLI**
   ```bash
   pnpm add -D @tauri-apps/cli
   ```

### Code Style

- **TypeScript**: Strict mode enabled, ESLint recommended
- **Rust**: Standard Rust formatting with `cargo fmt`
- **CSS**: Modern CSS with glassmorphism design patterns
- **Comments**: Comprehensive documentation for complex flows

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the code style guidelines
4. **Test thoroughly**: Ensure all flows work correctly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Provide clear description of changes

### Development Guidelines

- **Test all user flows**: Morning check-in, timer, breaks, notifications
- **Update documentation**: Keep README and config docs current
- **Follow privacy principles**: No data collection, local-first approach
- **Maintain accessibility**: Ensure app works for all users

### Testing

```bash
# Test notification system
cd src-tauri/scripts
osascript test_notification.scpt

# Test Rust backend
cd src-tauri
cargo test

# Test frontend build
pnpm build
```

## 🔧 Troubleshooting

### Common Issues

**Notification Not Working**
- Check macOS notification permissions
- Ensure app has accessibility permissions
- Try running `test_notification.scpt` manually

**Build Errors**
- Ensure Rust toolchain is up to date: `rustup update`
- Clear cargo cache: `cargo clean`
- Check Tauri version compatibility

**Timer Not Accurate**
- Check system time settings
- Ensure app isn't being throttled by macOS
- Verify timer configuration in `config.json`

### Debug Mode

Enable debug logging by modifying `src-tauri/tauri.conf.json`:
```json
{
  "tauri": {
    "cli": {
      "devPath": "http://localhost:1420",
      "distDir": "../dist"
    }
  }
}
```

### Performance Issues

- **High CPU Usage**: Check for infinite loops in timer logic
- **Memory Leaks**: Ensure proper cleanup in React effects
- **Slow Notifications**: Verify OSA script execution time

## 🔐 Privacy & Security

### Privacy-First Design

- **Local-First**: All data stored on your device
- **No Telemetry**: No data collection or analytics
- **Offline Capable**: Works without internet connection
- **No Accounts**: No registration or login required

### Data Storage

- **Local Files**: All data stored in app's local directory
- **No Cloud Sync**: Data never leaves your device
- **User Control**: Complete control over your data
- **Transparent**: Open source code for full transparency

### Security Features

- **Sandboxed**: Tauri provides native security isolation
- **No Network Access**: App doesn't require internet
- **Minimal Permissions**: Only requests necessary system access
- **Code Review**: All code is open source and reviewable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### License Summary

- **Permitted**: Use, modify, distribute, and commercial use
- **Required**: Include license and copyright notice
- **Not Provided**: Warranty or liability
- **Attribution**: Credit ScreenMind Team

## 🙏 Acknowledgments

- **Tauri Team**: For the excellent desktop app framework
- **React Team**: For the powerful frontend library
- **Rust Team**: For the safe and fast systems language
- **Open Source Community**: For inspiration and tools

---

**Made with ❤️ for better screen habits and eye health**
