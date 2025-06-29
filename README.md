# 👁️‍🗨️ ScreenMind

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS-blue.svg)](https://www.apple.com/macos/)
[![Framework: Tauri](https://img.shields.io/badge/Framework-Tauri-2.0-FFC131?logo=tauri&logoColor=black)](https://tauri.app/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Language: Rust](https://img.shields.io/badge/Language-Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Package Manager: pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-orange?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-green.svg)](https://github.com/yourusername/ScreenMind/releases)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/yourusername/ScreenMind)

> A local AI wellness assistant designed to improve screen habits by tracking attention, reminding users to take breaks, and providing mood check-ins — all while prioritizing user privacy and offline functionality.

## 🎯 Features

- **20-20-20 Timer**: Enforces the eye health rule (every 20 minutes, look 20 feet away for 20 seconds)
- **Smart Break System**: Automatic break reminders with user acknowledgment
- **Daily Mood Check-ins**: Morning wellness assessments with emoji-based responses
- **Break Reminders**: System notifications with sound and app foregrounding
- **Local Data Storage**: All data stays on your device - no cloud, no accounts
- **Dark Mode Interface**: Designed to reduce eye strain
- **Privacy-First**: No webcam access unless explicitly opted in
- **Session Statistics**: Track breaks taken, skipped, and streaks

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://rustup.rs/) (for Tauri)
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
- **UI Components**: Modern CSS with responsive design

### Backend (Tauri + Rust)
- **OSA Integration**: AppleScript for system notifications and app foregrounding
- **Process Management**: Multiple methods to bring app to front
- **Error Handling**: Robust fallback mechanisms for notification failures

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
│   └── main.tsx           # React entry point
├── src-tauri/             # Tauri backend
│   ├── src/               # Rust source code
│   │   ├── lib.rs         # OSA script integration
│   │   └── main.rs        # Tauri app entry
│   ├── scripts/           # AppleScript files
│   │   └── break_notification.scpt  # Notification and foreground logic
│   ├── tauri.conf.json    # Tauri configuration
│   └── Cargo.toml         # Rust dependencies
├── business/              # Configuration
│   └── config.json        # App settings, UI text, feature flags
├── public/                # Static assets
└── package.json           # Node.js dependencies
```

## 🎨 Design Philosophy

- **Minimalist**: Clean, distraction-free interface
- **Accessible**: High contrast, readable fonts
- **Responsive**: Works on different screen sizes
- **Non-intrusive**: Subtle notifications that don't interrupt workflow
- **User Control**: Always wait for user acknowledgment before actions

## 🔐 Privacy & Security

- **Local-First**: All data stored on your device
- **No Telemetry**: No data collection or analytics
- **Offline Capable**: Works without internet connection
- **Open Source**: Transparent codebase for community review
- **System Integration**: Uses native macOS notifications and sounds

## 🚧 Development Status

### ✅ Completed (v0.1.0)
- [x] Complete 20-20-20 timer with precise timing
- [x] Morning mood check-in system with emoji responses
- [x] Break reminder system with OSA integration
- [x] System notifications with sound and app foregrounding
- [x] User acknowledgment system with fallback mechanisms
- [x] Break countdown with user action buttons
- [x] Session statistics tracking (breaks taken, skipped, streaks)
- [x] Modern dark theme UI with glassmorphism effects
- [x] Responsive design for different screen sizes
- [x] Configuration system for easy customization
- [x] Production build system with DMG installer

### 🔄 In Progress
- [ ] Local data persistence (SQLite/JSON)
- [ ] Settings configuration panel
- [ ] Statistics dashboard with charts
- [ ] Custom break duration settings

### 📋 Planned Features
- [ ] Mouse activity tracking for automatic break detection
- [ ] Eye strain detection (optional webcam integration)
- [ ] Browser extension integration
- [ ] Calendar integration for break scheduling
- [ ] Export statistics to CSV/PDF
- [ ] Custom break actions and reminders
- [ ] Multi-platform support (Windows, Linux)

## 🌐 Platform Independence

ScreenMind is currently optimized for macOS but can be adapted for Windows and Linux with the following modifications:

### **Current macOS-Specific Features**
- **AppleScript Integration**: OSA scripts for notifications and app foregrounding
- **System Sounds**: macOS-specific sound files (`/System/Library/Sounds/`)
- **Process Management**: macOS-specific process naming conventions
- **Bundle Structure**: `.app` bundle format

### **Required Changes for Cross-Platform Support**

#### **Windows Adaptations**
1. **Notification System**:
   - Replace AppleScript with Windows API calls
   - Use `winapi` crate for system notifications
   - Implement Windows toast notifications
   - Add Windows sound files (`.wav` format)

2. **App Foregrounding**:
   - Use Windows API `SetForegroundWindow()`
   - Handle Windows process naming (`screen-mind-app.exe`)
   - Implement Windows-specific window management

3. **Build System**:
   - Add Windows target in `tauri.conf.json`
   - Configure Windows-specific icons (`.ico` format)
   - Set up Windows installer (NSIS or MSI)

#### **Linux Adaptations**
1. **Notification System**:
   - Replace AppleScript with `notify-send` command
   - Use `dbus` for system notifications
   - Implement Linux sound files (`.ogg` or `.wav`)
   - Add desktop notification integration

2. **App Foregrounding**:
   - Use X11/Wayland window management
   - Implement Linux process naming conventions
   - Handle different Linux desktop environments

3. **Build System**:
   - Add Linux targets (AppImage, .deb, .rpm)
   - Configure Linux-specific icons (`.png` format)
   - Set up Linux package managers

#### **Code Changes Required**

**1. Notification System Refactor**:
```rust
// Current macOS-specific code in src-tauri/src/lib.rs
#[cfg(target_os = "macos")]
fn send_break_notification() -> Result<String, String> {
    // AppleScript implementation
}

#[cfg(target_os = "windows")]
fn send_break_notification() -> Result<String, String> {
    // Windows API implementation
}

#[cfg(target_os = "linux")]
fn send_break_notification() -> Result<String, String> {
    // Linux dbus/notify-send implementation
}
```

**2. Sound System**:
```rust
// Platform-specific sound paths
#[cfg(target_os = "macos")]
const SOUND_PATH: &str = "/System/Library/Sounds/Submarine.aiff";

#[cfg(target_os = "windows")]
const SOUND_PATH: &str = "C:\\Windows\\Media\\chimes.wav";

#[cfg(target_os = "linux")]
const SOUND_PATH: &str = "/usr/share/sounds/freedesktop/stereo/complete.oga";
```

**3. Process Management**:
```rust
// Platform-specific process names
#[cfg(target_os = "macos")]
const PROCESS_NAMES: &[&str] = &["screen-mind-app", "ScreenMind"];

#[cfg(target_os = "windows")]
const PROCESS_NAMES: &[&str] = &["screen-mind-app.exe", "ScreenMind.exe"];

#[cfg(target_os = "linux")]
const PROCESS_NAMES: &[&str] = &["screen-mind-app", "screen_mind_app"];
```

#### **Configuration Updates**
Update `tauri.conf.json` for multi-platform support:
```json
{
  "bundle": {
    "targets": ["app", "dmg", "msi", "appimage", "deb"],
    "identifier": "com.screen-mind.app",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

#### **Testing Strategy**
1. **Unit Tests**: Platform-specific notification tests
2. **Integration Tests**: Cross-platform build verification
3. **Manual Testing**: Verify notifications on each OS
4. **CI/CD**: GitHub Actions for multi-platform builds

### **Estimated Effort**
- **Windows Support**: ~2-3 days of development
- **Linux Support**: ~3-4 days of development
- **Testing & Polish**: ~1-2 days per platform
- **Total**: ~1-2 weeks for full cross-platform support

The core timer logic and UI are already platform-independent, making the transition relatively straightforward with the above modifications.

## 🐛 Known Issues & Solutions

### Notification Issues
- **Problem**: Notifications not appearing
- **Solution**: Check macOS notification permissions for ScreenMind
- **Workaround**: Use fallback buttons in the app

### App Foreground Issues
- **Problem**: App doesn't come to front automatically
- **Solution**: OSA script tries multiple methods; manual clicking may be needed
- **Note**: This is expected behavior in development mode

### Timer Precision
- **Problem**: Timer may drift slightly over long sessions
- **Solution**: Timer resets every 20 minutes, minimizing drift impact

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code structure and patterns
- Test all control flows before submitting
- Update configuration files for new features
- Ensure OSA scripts work in both dev and production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details.

## 🙏 Acknowledgments

- Inspired by the 20-20-20 rule for eye health
- Built with [Tauri](https://tauri.app/) for cross-platform desktop apps
- Designed for digital workers and developers
- Uses native macOS integration for optimal user experience

---

**Remember**: Every 20 minutes, look 20 feet away for 20 seconds! 👁️‍🗨️

*Your eyes will thank you.*
