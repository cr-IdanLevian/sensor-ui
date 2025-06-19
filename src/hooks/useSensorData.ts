import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTimestamp } from '@/data/mockData';
import type {
	SensorApiResponse,
	MachineStatusType,
	CurrentScan,
} from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import CSharpHostService from '@/services/csharpHost';

interface UseSensorDataReturn {
	// Data
	sensorData: SensorApiResponse | null;
	currentScan: CurrentScan | null;

	// Loading states
	isLoading: boolean;
	isScanning: boolean;

	// Error handling
	error: string | null;

	// Actions
	refreshData: () => Promise<void>;
	startQuickScan: () => Promise<void>;
	startFullScan: () => Promise<void>;
	stopScan: () => Promise<void>;
	updateSensor: () => Promise<void>;

	// For testing
	setMachineStatus: (status: MachineStatusType) => Promise<void>;

	// Formatted data
	getFormattedTimestamp: (timestamp: number) => string;
}

export const useSensorData = (): UseSensorDataReturn => {
	const { formatDate } = useLanguage();
	const [sensorData, setSensorData] = useState<SensorApiResponse | null>(null);
	const [currentScan, setCurrentScan] = useState<CurrentScan | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Refs for intervals
	const dataPollingRef = useRef<NodeJS.Timeout | null>(null);
	const scanProgressRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch sensor data from C# host
	const fetchSensorData = useCallback(async () => {
		try {
			setError(null);
			const response = await CSharpHostService.getSensorStatus();
			setSensorData(response);
			setCurrentScan(response.data.scanHistory.currentScan || null);

			// Start scan progress simulation if scan is running
			if (response.data.scanHistory.currentScan?.isRunning) {
				startScanProgressTracking();
			}
		} catch (err) {
			setError('Failed to fetch sensor data');
			console.error('Error fetching sensor data:', err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Start scan progress tracking
	const startScanProgressTracking = useCallback(() => {
		if (scanProgressRef.current) {
			clearInterval(scanProgressRef.current);
		}

		scanProgressRef.current = setInterval(async () => {
			// For C# integration, we'll poll the status instead of simulating progress
			try {
				const response = await CSharpHostService.getSensorStatus();
				const updatedScan = response.data.scanHistory.currentScan;
				setCurrentScan(updatedScan || null);

				// Stop tracking when scan is complete
				if (!updatedScan?.isRunning && scanProgressRef.current) {
					clearInterval(scanProgressRef.current);
					scanProgressRef.current = null;
					// Refresh data to get updated scan history
					fetchSensorData();
				}
			} catch (error) {
				console.error('Error tracking scan progress:', error);
			}
		}, 1000);
	}, [fetchSensorData]);

	// Stop scan progress tracking
	const stopScanProgressTracking = useCallback(() => {
		if (scanProgressRef.current) {
			clearInterval(scanProgressRef.current);
			scanProgressRef.current = null;
		}
	}, []);

	// Refresh data manually
	const refreshData = useCallback(async () => {
		setIsLoading(true);
		await fetchSensorData();
	}, [fetchSensorData]);

	// Start quick scan
	const startQuickScan = useCallback(async () => {
		try {
			setError(null);
			const response = await CSharpHostService.startQuickScan();

			if (response.success) {
				// Refresh data to get updated scan state
				await fetchSensorData();
				startScanProgressTracking();
			} else {
				setError(response.message);
			}
		} catch (err) {
			setError('Failed to start quick scan');
			console.error('Error starting quick scan:', err);
		}
	}, [startScanProgressTracking, fetchSensorData]);

	// Start full scan
	const startFullScan = useCallback(async () => {
		try {
			setError(null);
			const response = await CSharpHostService.startFullScan();

			if (response.success) {
				// Refresh data to get updated scan state
				await fetchSensorData();
				startScanProgressTracking();
			} else {
				setError(response.message);
			}
		} catch (err) {
			setError('Failed to start full scan');
			console.error('Error starting full scan:', err);
		}
	}, [startScanProgressTracking, fetchSensorData]);

	// Stop scan
	const stopScan = useCallback(async () => {
		try {
			setError(null);
			const response = await CSharpHostService.stopScan();

			if (response.success) {
				stopScanProgressTracking();
				// Refresh data to get updated scan state
				await fetchSensorData();
			} else {
				setError(response.message);
			}
		} catch (err) {
			setError('Failed to stop scan');
			console.error('Error stopping scan:', err);
		}
	}, [stopScanProgressTracking]);

	// Update sensor
	const updateSensor = useCallback(async () => {
		try {
			setError(null);
			const response = await CSharpHostService.updateSensor();

			if (!response.success) {
				setError(response.message);
			}
			// In real app, this might trigger a data refresh after update
		} catch (err) {
			setError('Failed to update sensor');
			console.error('Error updating sensor:', err);
		}
	}, []);

	// Set machine status for testing
	const setMachineStatus = useCallback(
		async (status: MachineStatusType) => {
			try {
				await CSharpHostService.setMachineStatus(status);
				fetchSensorData(); // Refresh data to reflect new status
			} catch (err) {
				console.error('Error setting machine status:', err);
			}
		},
		[fetchSensorData]
	);

	// Format timestamp using current language
	const getFormattedTimestamp = useCallback(
		(timestamp: number): string => {
			return formatTimestamp(timestamp, formatDate);
		},
		[formatDate]
	);

	// Initial data fetch
	useEffect(() => {
		fetchSensorData();
	}, [fetchSensorData]);

	// Set up data polling (simulating real-time updates)
	useEffect(() => {
		// Poll for data every 30 seconds (when not scanning)
		const startPolling = () => {
			if (dataPollingRef.current) {
				clearInterval(dataPollingRef.current);
			}

			dataPollingRef.current = setInterval(() => {
				// Only poll if not currently scanning (scanning has its own updates)
				if (!currentScan?.isRunning) {
					fetchSensorData();
				}
			}, 30000); // 30 seconds
		};

		startPolling();

		return () => {
			if (dataPollingRef.current) {
				clearInterval(dataPollingRef.current);
			}
		};
	}, [fetchSensorData, currentScan?.isRunning]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopScanProgressTracking();
			if (dataPollingRef.current) {
				clearInterval(dataPollingRef.current);
			}
		};
	}, [stopScanProgressTracking]);

	return {
		// Data
		sensorData,
		currentScan,

		// States
		isLoading,
		isScanning: currentScan?.isRunning || false,
		error,

		// Actions
		refreshData,
		startQuickScan,
		startFullScan,
		stopScan,
		updateSensor,
		setMachineStatus,

		// Utilities
		getFormattedTimestamp,
	};
};
