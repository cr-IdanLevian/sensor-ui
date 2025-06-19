import logo from '@/assets/logo.svg';
import logoDark from '@/assets/logo-dark.svg';
import ScanIcon from '@/assets/icon/scan.svg';
import CommunicationIcon from '@/assets/icon/communication.svg';
import ReconIcon from '@/assets/icon/recon.svg';
import MachineIcon from '@/assets/icon/machine.svg';
import ReplaceFileIcon from '@/assets/icon/replace-file.svg';
import SensorLastPolicySyncIcon from '@/assets/icon/sensor-last-policy-sync.svg';

import { useState, useEffect, useCallback } from 'react';
import { StatusCard } from './StatusCard';
import { ScanInfoSection } from './ScanInfoSection';
import { SystemInfoSection } from './SystemInfoSection';
import { ActionButtons } from './ActionButtons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import type {
	ScanInfo,
	SystemInfo,
	ActionButton,
	ConnectionStatus,
	ScanProgress,
	MachineStatus,
} from './types';

const scanData: ScanInfo[] = [
	{
		icon: (
			<img src={ScanIcon} className='w-5 h-5 icon-themed' alt='Scan icon' />
		),
		label: 'Last quick scan',
		value: 'May 28, 2025 01:24 PM',
	},
	{
		icon: (
			<img src={ReconIcon} className='w-5 h-5 icon-themed' alt='recon icon' />
		),
		label: 'Last full scan',
		value: 'Jun 2, 2025 07:51 PM',
	},
];

// TODO: Get the data from the C# API
const connectionStatus: ConnectionStatus = 'Connected';

const systemData: SystemInfo[] = [
	{
		icon: (
			<img
				src={CommunicationIcon}
				className='w-5 h-5 icon-themed'
				alt='communication icon'
			/>
		),
		label: 'Connection',
		value: connectionStatus,
		isHighlighted: false,
		statusColor: connectionStatus === 'Connected' ? '#67D086' : '#F8CA35',
	},
	{
		icon: (
			<img
				src={MachineIcon}
				className='w-5 h-5 icon-themed'
				alt='machine icon'
			/>
		),
		label: 'Sensor version',
		value: '0.0.01',
	},
	{
		icon: (
			<img
				src={ReplaceFileIcon}
				className='w-5 h-5 icon-themed'
				alt='replace file icon'
			/>
		),
		label: 'Last DB update',
		value: 'Jun 9, 2025 02:21 PM',
	},
	{
		icon: (
			<img
				src={SensorLastPolicySyncIcon}
				className='w-5 h-5 icon-themed'
				alt='sensor last policy sync icon'
			/>
		),
		label: 'Last policy sync',
		value: 'Jun 21, 2025 04:47 PM',
	},
];

export const MainComponent = (): JSX.Element => {
	const { theme } = useTheme();
	const [machineStatus, setMachineStatus] = useState<MachineStatus>('AT RISK'); // Default to AT RISK to show the new design
	const [scanProgress, setScanProgress] = useState<ScanProgress>({
		percentage: 0,
		startTime: '',
		isRunning: false,
	});

	const formatTime = (date: Date): string => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	};

	const startFullScan = useCallback(() => {
		const startTime = formatTime(new Date());
		setScanProgress({
			percentage: 1,
			startTime,
			isRunning: true,
		});
	}, []);

	const stopScan = useCallback(() => {
		setScanProgress((prev) => ({
			...prev,
			isRunning: false,
		}));
	}, []);

	const handleQuickScan = useCallback(() => {
		// TODO: Implement quick scan functionality
		console.log('Quick scan clicked');
	}, []);

	const handleUpdate = useCallback(() => {
		// TODO: Implement update functionality
		console.log('Update clicked');
	}, []);

	// Toggle machine status for demonstration (you can remove this in production)
	const toggleMachineStatus = useCallback(() => {
		setMachineStatus((prev) => {
			switch (prev) {
				case 'SECURED':
					return 'AT RISK';
				case 'AT RISK':
					return 'DECOMMISSIONED';
				case 'DECOMMISSIONED':
					return 'ARCHIVED';
				case 'ARCHIVED':
					return 'SECURED';
				default:
					return 'SECURED';
			}
		});
	}, []);

	// Simulate progress when scan is running
	useEffect(() => {
		if (!scanProgress.isRunning) return;

		const interval = setInterval(() => {
			setScanProgress((prev) => {
				if (prev.percentage >= 100) {
					// Scan completed
					return {
						...prev,
						isRunning: false,
					};
				}
				// Increment progress (simulate varying speeds)
				const increment = Math.random() * 3 + 0.5; // Random increment between 0.5-3.5%
				return {
					...prev,
					percentage: Math.min(prev.percentage + increment, 100),
				};
			});
		}, 1000); // Update every second

		return () => clearInterval(interval);
	}, [scanProgress.isRunning]);

	// Action buttons - change based on scan state
	const actionButtons: ActionButton[] = scanProgress.isRunning
		? [
				{ label: 'Quick Scan', onClick: handleQuickScan, disabled: true },
				{ label: 'Stop Scan', onClick: stopScan },
				{ label: 'Update', onClick: handleUpdate, disabled: true },
		  ]
		: [
				{ label: 'Quick Scan', onClick: handleQuickScan },
				{ label: 'Full Scan', onClick: startFullScan },
				{ label: 'Update', onClick: handleUpdate },
		  ];

	// Check if we should show minimal view (only for DECOMMISSIONED and ARCHIVED)
	const isMinimalView =
		machineStatus === 'DECOMMISSIONED' || machineStatus === 'ARCHIVED';

	return (
		<>
			<ThemeToggle />
			{/* Temporary toggle button for demonstration - remove in production */}
			<button
				onClick={toggleMachineStatus}
				style={{
					position: 'absolute',
					top: '10px',
					left: '10px',
					padding: '8px 12px',
					backgroundColor: '#333',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					fontSize: '12px',
					cursor: 'pointer',
					zIndex: 1000,
				}}
			>
				Toggle Status ({machineStatus})
			</button>

			<div
				className='flex flex-col w-[404px] items-center gap-6 p-6 relative rounded-3xl border shadow-xl'
				style={{
					background:
						'var(--color-tokens-design-tokens-backgrounds-appbackground)',
					borderColor: 'var(--color-tokens-design-tokens-borders-appstroke)',
					boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
				}}
			>
				<header className='flex items-start justify-center gap-6 w-full'>
					<img
						className='w-[184px] h-10'
						alt='cybereason'
						src={theme === 'light' ? logoDark : logo}
					/>
				</header>
				<StatusCard status={machineStatus} />

				{/* Show full interface only when not in minimal view */}
				{!isMinimalView && (
					<>
						<ScanInfoSection scanData={scanData} />
						<SystemInfoSection systemData={systemData} />

						{/* Full Scan Progress Section - Show when scan is running */}
						{scanProgress.isRunning && (
							<div
								className='flex flex-col w-full p-6 gap-4 rounded-xl border'
								style={{
									background:
										'var(--color-tokens-design-tokens-backgrounds-cardbackground)',
									borderColor:
										'var(--color-tokens-design-tokens-borders-cardstroke)',
								}}
							>
								<div className='text-center'>
									<h2
										className='mb-4'
										style={{
											color:
												'var(--color-tokens-design-tokens-typography-primarytext)',
											fontFamily: 'Inter, sans-serif',
											fontSize: '14px',
											fontWeight: 700,
											lineHeight: '150%',
											letterSpacing: '0%',
										}}
									>
										Running full scan
									</h2>

									{/* Progress Bar */}
									<div className='w-full bg-gray-300 rounded-full h-3 mb-4 overflow-hidden'>
										<div
											className='h-full rounded-full transition-all duration-300 ease-out'
											style={{
												width: `${Math.floor(scanProgress.percentage)}%`,
												backgroundColor: '#F7C31C',
											}}
										/>
									</div>

									{/* Progress Info */}
									<div
										className='text-sm'
										style={{
											color:
												'var(--color-tokens-design-tokens-typography-secondarytext)',
										}}
									>
										{Math.floor(scanProgress.percentage)}% - Started at{' '}
										{scanProgress.startTime}
									</div>
								</div>
							</div>
						)}

						<ActionButtons buttons={actionButtons} />
					</>
				)}
			</div>
		</>
	);
};
