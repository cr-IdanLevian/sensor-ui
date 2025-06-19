// C# Host Interface - defines all methods available from C# webview
// This will be the bridge between React and C# backend

import {
	MockSensorApi,
	type SensorApiResponse,
	type MachineStatusType,
} from '@/data/mockData';

// Type definitions for C# host methods
interface CSharpHostMethods {
	// Sensor data operations
	GetSensorStatus?: () => Promise<string>; // Returns JSON string

	// Language operations
	GetLanguage?: () => Promise<string>; // Returns language code string (e.g., "en", "ja", "he")
	//
	// IMPLEMENTATION NOTE for C# Server Developer:
	// This method should return a language code string that corresponds to the user's preferred language.
	// Supported language codes:
	// - "en" or "EN" for English
	// - "ja" or "JA" for Japanese
	// - "he" or "HE" for Hebrew
	//
	// If no language is configured or an unsupported language is returned,
	// the UI will automatically fall back to English ("en").
	//
	// Example C# implementation:
	// public async Task<string> GetLanguage()
	// {
	//     // Return the user's configured language from your settings/config
	//     return userSettings.Language ?? "en"; // Default to English if not set
	// }

	// Scan operations
	StartQuickScan?: () => Promise<string>; // Returns JSON string with success/error
	StartFullScan?: () => Promise<string>; // Returns JSON string with success/error
	StopScan?: () => Promise<string>; // Returns JSON string with success/error

	// Sensor operations
	UpdateSensor?: () => Promise<string>; // Returns JSON string with success/error

	// Status operations (for testing)
	SetMachineStatus?: (status: string) => Promise<string>; // Returns JSON string

	// Real-time updates (C# will call these)
	OnScanProgressUpdate?: (progressData: string) => void;
	OnStatusChanged?: (statusData: string) => void;
}

// Extend Window interface to include chrome webview
declare global {
	interface Window {
		chrome?: {
			webview?: {
				hostObjects?: {
					csharpHost?: CSharpHostMethods;
				};
			};
		};
	}
}

// Response types for C# operations
export interface CSharpResponse {
	success: boolean;
	message?: string;
	data?: unknown;
}

// C# Host Service - handles all communication with C# backend
export class CSharpHostService {
	// Check if C# host is available
	private static isCSharpHostAvailable(): boolean {
		return !!window.chrome?.webview?.hostObjects?.csharpHost;
	}

	// Helper to safely call C# methods with fallback to mock
	private static async callCSharpMethod<T>(
		methodName: keyof CSharpHostMethods,
		fallbackMockMethod: () => Promise<T>,
		...args: unknown[]
	): Promise<T> {
		try {
			if (this.isCSharpHostAvailable()) {
				const method = window.chrome?.webview?.hostObjects?.csharpHost?.[
					methodName
				] as (...args: unknown[]) => Promise<string>;
				if (method) {
					console.log(`[C# Host] Calling ${methodName}`, args);
					const result = await method(...args);

					// C# returns JSON strings, so parse them
					if (typeof result === 'string') {
						try {
							return JSON.parse(result) as T;
						} catch (parseError) {
							console.error(
								`[C# Host] Failed to parse JSON result from ${methodName}:`,
								parseError
							);
							console.error(`[C# Host] Raw result:`, result);
							throw new Error(
								`Invalid JSON response from C# method ${methodName}`
							);
						}
					}
					return result as T;
				}
			}

			// Fallback to mock data
			console.warn(`[C# Host] ${methodName} not available, using mock data`);
			return await fallbackMockMethod();
		} catch (error) {
			console.error(`[C# Host] Error calling ${methodName}:`, error);
			// Fallback to mock on error
			return await fallbackMockMethod();
		}
	}

	// Get sensor status
	static async getSensorStatus(): Promise<SensorApiResponse> {
		return this.callCSharpMethod('GetSensorStatus', () =>
			MockSensorApi.getSensorStatus()
		);
	}

	// Get language from C# host
	static async getLanguage(): Promise<string> {
		return this.callCSharpMethod(
			'GetLanguage',
			async () => 'en' // Default fallback to English
		);
	}

	// Start quick scan
	static async startQuickScan(): Promise<{
		success: boolean;
		message: string;
	}> {
		return this.callCSharpMethod('StartQuickScan', () =>
			MockSensorApi.startQuickScan()
		);
	}

	// Start full scan
	static async startFullScan(): Promise<{ success: boolean; message: string }> {
		return this.callCSharpMethod('StartFullScan', () =>
			MockSensorApi.startFullScan()
		);
	}

	// Stop scan
	static async stopScan(): Promise<{ success: boolean; message: string }> {
		return this.callCSharpMethod('StopScan', () => MockSensorApi.stopScan());
	}

	// Update sensor
	static async updateSensor(): Promise<{ success: boolean; message: string }> {
		return this.callCSharpMethod('UpdateSensor', () =>
			MockSensorApi.updateSensor()
		);
	}

	// Set machine status (for testing)
	static async setMachineStatus(
		status: MachineStatusType
	): Promise<{ success: boolean; message: string }> {
		return this.callCSharpMethod(
			'SetMachineStatus',
			async () => {
				MockSensorApi.setMachineStatus(status);
				return { success: true, message: `Status set to ${status}` };
			},
			status
		);
	}

	// Register callbacks for C# to call (real-time updates)
	static registerCallbacks(callbacks: {
		onScanProgressUpdate?: (progressData: unknown) => void;
		onStatusChanged?: (statusData: unknown) => void;
	}): void {
		if (this.isCSharpHostAvailable()) {
			// Register callbacks that C# can call
			if (callbacks.onScanProgressUpdate) {
				window.chrome!.webview!.hostObjects!.csharpHost!.OnScanProgressUpdate =
					(progressData: string) => {
						try {
							const data =
								typeof progressData === 'string'
									? JSON.parse(progressData)
									: progressData;
							callbacks.onScanProgressUpdate!(data);
						} catch (error) {
							console.error(
								'[C# Host] Error parsing scan progress data:',
								error
							);
							console.error('[C# Host] Raw progress data:', progressData);
						}
					};
			}

			if (callbacks.onStatusChanged) {
				window.chrome!.webview!.hostObjects!.csharpHost!.OnStatusChanged = (
					statusData: string
				) => {
					try {
						const data =
							typeof statusData === 'string'
								? JSON.parse(statusData)
								: statusData;
						callbacks.onStatusChanged!(data);
					} catch (error) {
						console.error('[C# Host] Error parsing status data:', error);
						console.error('[C# Host] Raw status data:', statusData);
					}
				};
			}

			console.log('[C# Host] Callbacks registered successfully');
		} else {
			console.warn('[C# Host] Not available, callbacks not registered');
		}
	}

	// Utility methods
	static isAvailable(): boolean {
		return this.isCSharpHostAvailable();
	}

	static getHostInfo(): { available: boolean; methods: string[] } {
		const available = this.isCSharpHostAvailable();
		const methods: string[] = [];

		if (available) {
			const host = window.chrome?.webview?.hostObjects?.csharpHost;
			if (host) {
				methods.push(
					...Object.keys(host).filter(
						(key) =>
							typeof (host as Record<string, unknown>)[key] === 'function'
					)
				);
			}
		}

		return { available, methods };
	}
}

// Export for use in components
export default CSharpHostService;
