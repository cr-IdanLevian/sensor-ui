# Sensor UI - React + C# WebView Integration

A modern sensor monitoring UI built with React TypeScript that seamlessly integrates with C# backend applications using WebView2 technology.

## 🚀 Features

- **Modern React UI** with TypeScript and Tailwind CSS
- **C# WebView2 Integration** with automatic fallback to mock data
- **Multi-language Support** (English, Japanese, Hebrew with RTL)
- **Dark/Light Theme** with system preference detection
- **Real-time Sensor Monitoring** with scan progress tracking
- **Single File Build** for easy C# application embedding

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Custom Hooks** for state management
- **Context API** for theme and language management

### C# Integration
- **WebView2** for native C# application embedding
- **Bidirectional Communication** between React and C#
- **Type-safe Interfaces** for all C# method calls
- **Automatic Fallback** to mock data during development

## 🔧 C# WebView Integration

### How It Works

The application uses a sophisticated bridge system that allows React to communicate with C# methods seamlessly:

```typescript
// React calls C# method with automatic fallback
const result = await CSharpHostService.startQuickScan();

// Behind the scenes:
// 1. Check if C# WebView host is available
// 2. Call: window.chrome.webview.hostObjects.csharpHost.StartQuickScan()
// 3. Parse JSON response from C#
// 4. If C# unavailable, fallback to mock data
```

### Supported Operations

| React Function | C# Method | Purpose |
|----------------|-----------|---------|
| `getSensorStatus()` | `GetSensorStatus()` | Get current sensor data |
| `startQuickScan()` | `StartQuickScan()` | Start quick scan |
| `startFullScan()` | `StartFullScan()` | Start full scan |
| `stopScan()` | `StopScan()` | Stop current scan |
| `updateSensor()` | `UpdateSensor()` | Update sensor |
| `setMachineStatus()` | `SetMachineStatus(status)` | Change machine status |

### C# Implementation Requirements

Your C# application needs to implement these methods:

```csharp
public class SensorHost
{
    // All methods should return JSON strings
    public async Task<string> GetSensorStatus()
    {
        var sensorData = await GetCurrentSensorData();
        return JsonSerializer.Serialize(sensorData);
    }
    
    public async Task<string> StartQuickScan()
    {
        var result = await InitiateQuickScan();
        return JsonSerializer.Serialize(new { 
            success = result.Success, 
            message = result.Message 
        });
    }
    
    public async Task<string> StartFullScan()
    {
        var result = await InitiateFullScan();
        return JsonSerializer.Serialize(new { 
            success = result.Success, 
            message = result.Message 
        });
    }
    
    public async Task<string> StopScan()
    {
        var result = await HaltCurrentScan();
        return JsonSerializer.Serialize(new { 
            success = result.Success, 
            message = result.Message 
        });
    }
    
    public async Task<string> UpdateSensor()
    {
        var result = await PerformSensorUpdate();
        return JsonSerializer.Serialize(new { 
            success = result.Success, 
            message = result.Message 
        });
    }
    
    public async Task<string> SetMachineStatus(string status)
    {
        var result = await ChangeMachineStatus(status);
        return JsonSerializer.Serialize(new { 
            success = result.Success, 
            message = result.Message 
        });
    }
}
```

### WebView2 Setup

In your C# application:

```csharp
// Initialize WebView2 and add host object
await webView.EnsureCoreWebView2Async();
webView.CoreWebView2.AddHostObjectToScript("csharpHost", new SensorHost());

// Navigate to your built React app
webView.CoreWebView2.Navigate("file:///path/to/dist/index.html");
```

### Real-time Updates

For real-time updates from C# to React:

```csharp
// In your C# application, call JavaScript callbacks
private async void OnScanProgressChanged(ScanProgress progress)
{
    var json = JsonSerializer.Serialize(progress);
    await webView.CoreWebView2.ExecuteScriptAsync(
        $"window.chrome?.webview?.hostObjects?.csharpHost?.OnScanProgressUpdate?.('{json}')"
    );
}

private async void OnStatusChanged(StatusData status)
{
    var json = JsonSerializer.Serialize(status);
    await webView.CoreWebView2.ExecuteScriptAsync(
        $"window.chrome?.webview?.hostObjects?.csharpHost?.OnStatusChanged?.('{json}')"
    );
}
```

## 📦 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sensor-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Features

- **Hot Reload**: Changes reflect immediately
- **Mock Data**: Full functionality without C# backend
- **Debug Panel**: Test C# integration (development only)
- **Multi-language**: Switch between English, Japanese, Hebrew
- **Theme Toggle**: Light/dark mode switching

## 🏗️ Building for Production

### Single File Build

The application builds to a single HTML file for easy C# integration:

```bash
# Build for production
npm run build

# Output: dist/index.html (single file with all assets inlined)
```

### Build Configuration

The build process:
- **Inlines all CSS and JavaScript** into a single HTML file
- **Optimizes assets** for minimal file size
- **Generates source maps** for debugging
- **Uses ES2015+ target** for broad compatibility

## 🎯 Key Features

### Smart Fallback System
- ✅ **Development**: Works in browser with realistic mock data
- ✅ **Production**: Uses real C# backend when available
- ✅ **Error Handling**: Graceful degradation on C# failures
- ✅ **Type Safety**: Full TypeScript support throughout

### Multi-language Support
- **English**: Default language with 12-hour time format
- **Japanese**: Full localization with 24-hour time format
- **Hebrew**: RTL layout support with proper text direction

### Theme System
- **Light/Dark modes** with CSS custom properties
- **System preference detection** and persistence
- **Smooth transitions** between themes
- **Icon theming** with SVG filters

### Real-time Monitoring
- **Live sensor status** updates
- **Scan progress tracking** with visual progress bars
- **Connection status** monitoring
- **Automatic data refresh** every 30 seconds

## 🛠️ Project Structure

```
src/
├── components/ui/          # Reusable UI components
│   ├── button.tsx         # Button component
│   ├── card.tsx           # Card component
│   ├── theme-toggle.tsx   # Theme switcher
│   ├── language-toggle.tsx # Language switcher
│   └── csharp-debug.tsx   # C# integration debug panel
├── contexts/              # React contexts
│   ├── ThemeContext.tsx   # Theme management
│   └── LanguageContext.tsx # Language and localization
├── data/                  # Data layer
│   └── mockData.ts        # Mock API and type definitions
├── hooks/                 # Custom React hooks
│   └── useSensorData.ts   # Main data management hook
├── screens/               # Main application screens
│   └── MainComponent/     # Primary sensor UI
├── services/              # External service integrations
│   └── csharpHost.ts      # C# WebView integration service
└── lib/                   # Utility functions
    ├── theme.ts           # Theme utilities
    └── utils.ts           # General utilities
```

## 🔍 Debug Tools

### Development Debug Panel

In development mode, a debug panel shows:
- **Connection Status**: C# Connected vs Mock Mode
- **Available Methods**: Lists detected C# methods
- **Test Buttons**: Individual method testing
- **Results Display**: JSON responses and errors
- **Real-time Callbacks**: Live callback data from C#

### Console Logging

Comprehensive logging system:
- **C# Method Calls**: All calls logged with parameters
- **Fallback Usage**: When mock data is used
- **Error Details**: Full error context and stack traces
- **Performance**: Method execution times

## 🚀 Deployment

### For C# Applications

1. **Build the React app**:
   ```bash
   npm run build
   ```

2. **Copy `dist/index.html`** to your C# project

3. **Implement the required C# methods** in your host class

4. **Set up WebView2** in your C# application:
   ```csharp
   webView.CoreWebView2.AddHostObjectToScript("csharpHost", new SensorHost());
   webView.CoreWebView2.Navigate("file:///path/to/index.html");
   ```

### Standalone Web Application

The app also works as a standalone web application with full mock data functionality for testing and development.

## 📝 API Reference

### Data Types

```typescript
// Main sensor data structure
interface SensorApiResponse {
    success: boolean;
    timestamp: number;
    data: SensorData;
}

interface SensorData {
    machineStatus: 'SECURED' | 'AT RISK' | 'DECOMMISSIONED' | 'ARCHIVED';
    connectionStatus: 'CONNECTED' | 'DISCONNECTED';
    sensorInfo: SensorInfo;
    scanHistory: ScanHistory;
    systemInfo: SystemInfo;
}
```

### Hook Usage

```typescript
const {
    sensorData,        // Current sensor data
    currentScan,       // Active scan information
    isLoading,         // Loading state
    isScanning,        // Whether a scan is running
    error,             // Error message if any
    startQuickScan,    // Start quick scan function
    startFullScan,     // Start full scan function
    stopScan,          // Stop scan function
    updateSensor,      // Update sensor function
    setMachineStatus,  // Set machine status (testing)
    getFormattedTimestamp // Format timestamps per language
} = useSensorData();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both mock data and C# integration
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React, TypeScript, and C# WebView2 integration**
