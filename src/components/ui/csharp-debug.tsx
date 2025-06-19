import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import CSharpHostService from '@/services/csharpHost';
import type { MachineStatusType } from '@/data/mockData';

interface CSharpDebugProps {
	className?: string;
}

export const CSharpDebug: React.FC<CSharpDebugProps> = ({ className }) => {
	const [hostInfo, setHostInfo] = useState<{
		available: boolean;
		methods: string[];
	}>({
		available: false,
		methods: [],
	});
	const [testResult, setTestResult] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	// Check host status on mount
	useEffect(() => {
		const checkHostStatus = () => {
			const info = CSharpHostService.getHostInfo();
			setHostInfo(info);
		};

		checkHostStatus();

		// Check periodically in case C# host becomes available
		const interval = setInterval(checkHostStatus, 5000);

		return () => clearInterval(interval);
	}, []);

	// Register callbacks for real-time updates from C#
	useEffect(() => {
		CSharpHostService.registerCallbacks({
			onScanProgressUpdate: (progressData) => {
				console.log('[C# Debug] Scan progress update:', progressData);
				setTestResult(
					(prev) => `${prev}\n[Scan Progress] ${JSON.stringify(progressData)}`
				);
			},
			onStatusChanged: (statusData) => {
				console.log('[C# Debug] Status changed:', statusData);
				setTestResult(
					(prev) => `${prev}\n[Status Change] ${JSON.stringify(statusData)}`
				);
			},
		});
	}, []);

	const testMethod = async (methodName: string, ...args: unknown[]) => {
		setIsLoading(true);
		setTestResult('');

		try {
			let result;

			switch (methodName) {
				case 'getSensorStatus':
					result = await CSharpHostService.getSensorStatus();
					break;
				case 'startQuickScan':
					result = await CSharpHostService.startQuickScan();
					break;
				case 'startFullScan':
					result = await CSharpHostService.startFullScan();
					break;
				case 'stopScan':
					result = await CSharpHostService.stopScan();
					break;
				case 'updateSensor':
					result = await CSharpHostService.updateSensor();
					break;
				case 'setMachineStatus':
					result = await CSharpHostService.setMachineStatus(
						args[0] as MachineStatusType
					);
					break;
				default:
					throw new Error(`Unknown method: ${methodName}`);
			}

			setTestResult(
				`✅ ${methodName} success:\n${JSON.stringify(result, null, 2)}`
			);
		} catch (error) {
			setTestResult(
				`❌ ${methodName} error:\n${
					error instanceof Error ? error.message : String(error)
				}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	const clearResults = () => {
		setTestResult('');
	};

	return (
		<Card className={`p-4 space-y-4 ${className || ''}`}>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold'>C# Host Debug</h3>
				<div
					className={`px-2 py-1 rounded text-sm ${
						hostInfo.available
							? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
							: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
					}`}
				>
					{hostInfo.available ? 'Connected' : 'Mock Mode'}
				</div>
			</div>

			<div className='space-y-2'>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					Status:{' '}
					{hostInfo.available
						? 'C# WebView host is available'
						: 'Using mock data fallback'}
				</p>

				{hostInfo.methods.length > 0 && (
					<div>
						<p className='text-sm font-medium'>Available C# Methods:</p>
						<ul className='text-xs text-gray-500 dark:text-gray-400 ml-4'>
							{hostInfo.methods.map((method) => (
								<li key={method}>• {method}</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div className='space-y-2'>
				<h4 className='text-sm font-medium'>Test Methods:</h4>
				<div className='grid grid-cols-2 gap-2'>
					<Button
						size='sm'
						variant='outline'
						onClick={() => testMethod('getSensorStatus')}
						disabled={isLoading}
					>
						Get Status
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={() => testMethod('startQuickScan')}
						disabled={isLoading}
					>
						Quick Scan
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={() => testMethod('startFullScan')}
						disabled={isLoading}
					>
						Full Scan
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={() => testMethod('stopScan')}
						disabled={isLoading}
					>
						Stop Scan
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={() => testMethod('updateSensor')}
						disabled={isLoading}
					>
						Update
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={() => testMethod('setMachineStatus', 'HEALTHY')}
						disabled={isLoading}
					>
						Set Healthy
					</Button>
				</div>
			</div>

			{testResult && (
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<h4 className='text-sm font-medium'>Test Results:</h4>
						<Button size='sm' variant='ghost' onClick={clearResults}>
							Clear
						</Button>
					</div>
					<pre className='text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-40'>
						{testResult}
					</pre>
				</div>
			)}

			{isLoading && (
				<div className='text-center text-sm text-gray-500 dark:text-gray-400'>
					Testing method...
				</div>
			)}
		</Card>
	);
};
