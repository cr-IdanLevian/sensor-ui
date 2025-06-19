// Mock data simulating C# server responses
// Dates are Unix timestamps (milliseconds) as they would come from C#

export interface SensorApiResponse {
	success: boolean;
	timestamp: number;
	data: SensorData;
}

export interface SensorData {
	machineStatus: MachineStatusType;
	connectionStatus: ConnectionStatusType;
	sensorInfo: SensorInfo;
	scanHistory: ScanHistory;
	systemInfo: SystemInfo;
}

export type MachineStatusType =
	| 'SECURED'
	| 'AT RISK'
	| 'DECOMMISSIONED'
	| 'ARCHIVED';
export type ConnectionStatusType = 'CONNECTED' | 'DISCONNECTED';

export interface SensorInfo {
	version: string;
	lastPolicySync: number; // Unix timestamp
	lastDbUpdate: number; // Unix timestamp
}

export interface ScanHistory {
	lastQuickScan: number; // Unix timestamp
	lastFullScan: number; // Unix timestamp
	currentScan?: CurrentScan;
}

export interface CurrentScan {
	isRunning: boolean;
	type: 'QUICK' | 'FULL';
	startTime: number; // Unix timestamp
	progress: number; // 0-100
}

export interface SystemInfo {
	connectionStatus: ConnectionStatusType;
	connectionStatusColor: string;
}

// Mock API Response - simulating what C# server would return
export const mockApiResponse: SensorApiResponse = {
	success: true,
	timestamp: Date.now(),
	data: {
		machineStatus: 'AT RISK',
		connectionStatus: 'CONNECTED',
		sensorInfo: {
			version: '0.0.01',
			lastPolicySync: 1719157620000, // Jun 21, 2025 04:47 PM
			lastDbUpdate: 1717947660000, // Jun 9, 2025 02:21 PM
		},
		scanHistory: {
			lastQuickScan: 1716890640000, // May 28, 2025 01:24 PM
			lastFullScan: 1717359060000, // Jun 2, 2025 07:51 PM
			currentScan: {
				isRunning: false,
				type: 'FULL',
				startTime: 0,
				progress: 0,
			},
		},
		systemInfo: {
			connectionStatus: 'CONNECTED',
			connectionStatusColor: '#67D086',
		},
	},
};

// Mock different machine statuses for testing
export const mockStatusVariations: Record<
	MachineStatusType,
	SensorApiResponse
> = {
	SECURED: {
		...mockApiResponse,
		data: {
			...mockApiResponse.data,
			machineStatus: 'SECURED',
		},
	},
	'AT RISK': {
		...mockApiResponse,
		data: {
			...mockApiResponse.data,
			machineStatus: 'AT RISK',
		},
	},
	DECOMMISSIONED: {
		...mockApiResponse,
		data: {
			...mockApiResponse.data,
			machineStatus: 'DECOMMISSIONED',
			connectionStatus: 'DISCONNECTED',
			systemInfo: {
				connectionStatus: 'DISCONNECTED',
				connectionStatusColor: '#F8CA35',
			},
		},
	},
	ARCHIVED: {
		...mockApiResponse,
		data: {
			...mockApiResponse.data,
			machineStatus: 'ARCHIVED',
			connectionStatus: 'DISCONNECTED',
			systemInfo: {
				connectionStatus: 'DISCONNECTED',
				connectionStatusColor: '#F8CA35',
			},
		},
	},
};

// Mock API functions (simulating C# endpoints)
export class MockSensorApi {
	private static currentStatus: MachineStatusType = 'AT RISK';
	private static currentScan: CurrentScan = {
		isRunning: false,
		type: 'FULL',
		startTime: 0,
		progress: 0,
	};

	// Helper method to get current status variation safely
	private static getCurrentStatusVariation(): SensorApiResponse {
		const variation = mockStatusVariations[this.currentStatus];
		if (!variation) {
			console.warn(
				`Invalid status: ${this.currentStatus}, falling back to AT RISK`
			);
			return mockStatusVariations['AT RISK'];
		}
		return variation;
	}

	// GET /api/sensor/status
	static async getSensorStatus(): Promise<SensorApiResponse> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 100));

		const statusVariation = this.getCurrentStatusVariation();

		return {
			...statusVariation,
			timestamp: Date.now(),
			data: {
				...statusVariation.data,
				scanHistory: {
					...statusVariation.data.scanHistory,
					currentScan: { ...this.currentScan },
				},
			},
		};
	}

	// POST /api/sensor/scan/quick
	static async startQuickScan(): Promise<{
		success: boolean;
		message: string;
	}> {
		await new Promise((resolve) => setTimeout(resolve, 200));

		if (this.currentScan.isRunning) {
			return { success: false, message: 'Scan already in progress' };
		}

		this.currentScan = {
			isRunning: true,
			type: 'QUICK',
			startTime: Date.now(),
			progress: 1,
		};

		return { success: true, message: 'Quick scan started' };
	}

	// POST /api/sensor/scan/full
	static async startFullScan(): Promise<{ success: boolean; message: string }> {
		await new Promise((resolve) => setTimeout(resolve, 200));

		if (this.currentScan.isRunning) {
			return { success: false, message: 'Scan already in progress' };
		}

		this.currentScan = {
			isRunning: true,
			type: 'FULL',
			startTime: Date.now(),
			progress: 1,
		};

		return { success: true, message: 'Full scan started' };
	}

	// POST /api/sensor/scan/stop
	static async stopScan(): Promise<{ success: boolean; message: string }> {
		await new Promise((resolve) => setTimeout(resolve, 100));

		this.currentScan.isRunning = false;
		return { success: true, message: 'Scan stopped' };
	}

	// POST /api/sensor/update
	static async updateSensor(): Promise<{ success: boolean; message: string }> {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return { success: true, message: 'Sensor update initiated' };
	}

	// Simulate scan progress (would be called by polling or WebSocket in real app)
	static updateScanProgress(): void {
		if (this.currentScan.isRunning && this.currentScan.progress < 100) {
			const increment = Math.random() * 3 + 0.5; // Random increment between 0.5-3.5%
			this.currentScan.progress = Math.min(
				this.currentScan.progress + increment,
				100
			);

			if (this.currentScan.progress >= 100) {
				this.currentScan.isRunning = false;
			}
		}
	}

	// For testing - change machine status
	static setMachineStatus(status: MachineStatusType): void {
		// Validate that the status exists in our variations
		if (status in mockStatusVariations) {
			this.currentStatus = status;
		} else {
			console.warn(
				`Invalid machine status: ${status}, keeping current status: ${this.currentStatus}`
			);
		}
	}

	// Get current scan state
	static getCurrentScan(): CurrentScan {
		return { ...this.currentScan };
	}
}

// Helper function to convert Unix timestamp to Date object
export const timestampToDate = (timestamp: number): Date => {
	return new Date(timestamp);
};

// Helper function to format timestamp using the language context
export const formatTimestamp = (
	timestamp: number,
	formatDate: (date: Date | string) => string
): string => {
	return formatDate(timestampToDate(timestamp));
};
