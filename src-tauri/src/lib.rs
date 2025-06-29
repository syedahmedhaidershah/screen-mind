// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send_break_notification() -> Result<String, String> {
    // Try multiple possible script paths
    let possible_paths = vec![
        // Development path (current directory is already src-tauri)
        std::env::current_dir()
            .map_err(|e| format!("Failed to get current dir: {}", e))?
            .join("scripts")
            .join("break_notification.scpt"),
        
        // Alternative development path (from project root)
        std::env::current_dir()
            .map_err(|e| format!("Failed to get current dir: {}", e))?
            .parent()
            .ok_or("Failed to get parent directory")?
            .join("src-tauri")
            .join("scripts")
            .join("break_notification.scpt"),
        
        // Production path (bundled)
        std::env::current_exe()
            .map_err(|e| format!("Failed to get executable path: {}", e))?
            .parent()
            .ok_or("Failed to get executable directory")?
            .join("resources")
            .join("scripts")
            .join("break_notification.scpt"),
    ];
    
    let mut script_path = None;
    for path in &possible_paths {
        if path.exists() {
            script_path = Some(path.clone());
            break;
        }
    }
    
    let script_path = script_path.ok_or("Script not found")?;
    
    // Execute the OSA script
    let output = Command::new("osascript")
        .arg(script_path.to_str().ok_or("Invalid script path")?)
        .output()
        .map_err(|e| format!("Failed to execute OSA script: {}", e))?;
    
    if output.status.success() {
        let result = String::from_utf8(output.stdout)
            .map_err(|e| format!("Failed to parse script output: {}", e))?;
        Ok(result.trim().to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("OSA script failed: {}", error))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, send_break_notification])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
