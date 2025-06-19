# C# WebView Integration Requirements

## Required C# Methods for Sensor UI

### 1. **Data Fetching Methods**

#### `GetSensorStatus()`
**Returns:** JSON string with sensor data
```csharp
public async Task<string> GetSensorStatus()
{
    var sensorData = new {
        success = true,
        data = new {
            machineStatus = "SECURED", // "SECURED" | "AT RISK" | "DECOMMISSIONED" | "ARCHIVED"
            connectionStatus = "CONNECTED", // "CONNECTED" | "DISCONNECTED"
            scanHistory = new {
                lastQuickScan = "2024-06-19T14:30:00Z", // ISO date string
                lastFullScan = "2024-06-18T10:15:00Z"   // ISO date string
            },
            sensorInfo = new {
                version = "1.2.3",
                lastDbUpdate = "2024-06-19T12:00:00Z",     // ISO date string
                lastPolicySync = "2024-06-19T11:45:00Z"    // ISO date string
            },
            systemInfo = new {
                connectionStatusColor = "#67D086" // Green for connected, red for disconnected
            }
        }
    };
    return JsonSerializer.Serialize(sensorData);
}
```

#### `GetLanguage()`
**Returns:** Language code string
```csharp
public async Task<string> GetLanguage()
{
    return userSettings.Language ?? "en"; // "en" | "ja" | "he"
}
```

#### `GetTheme()`
**Returns:** Theme string
```csharp
public async Task<string> GetTheme()
{
    return userSettings.Theme ?? "dark"; // "light" | "dark"
}
```

### 2. **Action Methods**

#### `StartQuickScan()`
**Returns:** JSON string with success/error
```csharp
public async Task<string> StartQuickScan()
{
    try {
        // Your scan logic here
        var result = new { success = true, message = "Quick scan started" };
        return JsonSerializer.Serialize(result);
    } catch (Exception ex) {
        var error = new { success = false, message = ex.Message };
        return JsonSerializer.Serialize(error);
    }
}
```

#### `StartFullScan()`
**Returns:** JSON string with success/error
```csharp
public async Task<string> StartFullScan()
{
    try {
        // Your scan logic here
        var result = new { success = true, message = "Full scan started" };
        return JsonSerializer.Serialize(result);
    } catch (Exception ex) {
        var error = new { success = false, message = ex.Message };
        return JsonSerializer.Serialize(error);
    }
}
```

#### `StopScan()`
**Returns:** JSON string with success/error
```csharp
public async Task<string> StopScan()
{
    try {
        // Your stop scan logic here
        var result = new { success = true, message = "Scan stopped" };
        return JsonSerializer.Serialize(result);
    } catch (Exception ex) {
        var error = new { success = false, message = ex.Message };
        return JsonSerializer.Serialize(error);
    }
}
```

#### `UpdateSensor()`
**Returns:** JSON string with success/error
```csharp
public async Task<string> UpdateSensor()
{
    try {
        // Your update logic here
        var result = new { success = true, message = "Sensor updated successfully" };
        return JsonSerializer.Serialize(result);
    } catch (Exception ex) {
        var error = new { success = false, message = ex.Message };
        return JsonSerializer.Serialize(error);
    }
}
```

### 3. **Settings Methods**

#### `SetLanguage(string language)`
**Returns:** JSON string with success/error
```csharp
public async Task<string> SetLanguage(string language)
{
    try {
        userSettings.Language = language;
        await SaveSettings();
        var result = new { success = true, message = "Language updated" };
        return JsonSerializer.Serialize(result);
    } catch (Exception ex) {
        var error = new { success = false, message = ex.Message };
        return JsonSerializer.Serialize(error);
    }
}
```

#### `SetTheme(string theme)`
**Returns:** JSON string with success/error
```csharp
public async Task<string> SetTheme(string theme)
{
    try {
        userSettings.Theme = theme;
        await SaveSettings();
        var result = new { success = true, message = "Theme updated" };
        return JsonSerializer.Serialize(result);
    } catch (Exception ex) {
        var error = new { success = false, message = ex.Message };
        return JsonSerializer.Serialize(error);
    }
}
```

### 4. **Real-time Update Callbacks (Optional)**

These are methods the UI provides that you can call from C# to send real-time updates:

#### `OnScanProgressUpdate(string progressData)`
Call this to update scan progress:
```csharp
// Example usage in your C# code:
var progressData = new {
    progress = 45.5,  // Percentage (0-100)
    startTime = "2024-06-19T14:30:00Z",
    currentFile = "C:\\Windows\\System32\\file.exe"
};
webView.CoreWebView2.PostWebMessageAsString($"OnScanProgressUpdate:{JsonSerializer.Serialize(progressData)}");
```

#### `OnStatusChanged(string statusData)`
Call this when machine status changes:
```csharp
// Example usage in your C# code:
var statusData = new {
    machineStatus = "AT RISK",
    connectionStatus = "CONNECTED"
};
webView.CoreWebView2.PostWebMessageAsString($"OnStatusChanged:{JsonSerializer.Serialize(statusData)}");
```

## Summary
- **8 methods** to implement
- All methods return **JSON strings**
- **Error handling** should return `{success: false, message: "error details"}`
- **Success responses** should return `{success: true, message: "success message"}`
- **ISO date format** for all timestamps: `"2024-06-19T14:30:00Z"`

The UI will automatically fall back to mock data if any method is not available. 