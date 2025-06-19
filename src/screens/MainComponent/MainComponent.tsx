import logo from '@/assets/logo.svg';
import logoDark from '@/assets/logo-dark.svg';
import ScanIcon from '@/assets/icon/scan.svg';
import CommunicationIcon from '@/assets/icon/communication.svg';
import ReconIcon from '@/assets/icon/recon.svg';
import MachineIcon from '@/assets/icon/machine.svg';
import ReplaceFileIcon from '@/assets/icon/replace-file.svg';
import SensorLastPolicySyncIcon from '@/assets/icon/sensor-last-policy-sync.svg';

import { useCallback } from 'react';
import { StatusCard } from './StatusCard';
import { ScanInfoSection } from './ScanInfoSection';
import { SystemInfoSection } from './SystemInfoSection';
import { ActionButtons } from './ActionButtons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSensorData } from '@/hooks/useSensorData';
import { CSharpDebug } from '@/components/ui/csharp-debug';
import type { ScanInfo, SystemInfo, ActionButton } from './types';
import type { MachineStatusType } from '@/data/mockData';

export const MainComponent = (): JSX.Element => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const {
		sensorData,
		currentScan,
		isLoading,
		isScanning,
		error,
		startQuickScan,
		startFullScan,
		stopScan,
		updateSensor,
		setMachineStatus,
		getFormattedTimestamp,
	} = useSensorData();

	// Toggle machine status for demonstration (you can remove this in production)
	const toggleMachineStatus = useCallback(() => {
		if (!sensorData) return;

		const currentStatus = sensorData.data.machineStatus;
		let nextStatus: MachineStatusType;

		switch (currentStatus) {
			case 'SECURED':
				nextStatus = 'AT RISK';
				break;
			case 'AT RISK':
				nextStatus = 'DECOMMISSIONED';
				break;
			case 'DECOMMISSIONED':
				nextStatus = 'ARCHIVED';
				break;
			case 'ARCHIVED':
				nextStatus = 'SECURED';
				break;
			default:
				nextStatus = 'SECURED';
		}

		setMachineStatus(nextStatus);
	}, [sensorData, setMachineStatus]);

	// Early return if loading
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!sensorData) {
		return <div>No data available</div>;
	}

	const scanData: ScanInfo[] = [
		{
			icon: (
				<img src={ScanIcon} className='w-5 h-5 icon-themed' alt='Scan icon' />
			),
			label: t('lastQuickScan'),
			value: getFormattedTimestamp(sensorData.data.scanHistory.lastQuickScan),
		},
		{
			icon: (
				<img src={ReconIcon} className='w-5 h-5 icon-themed' alt='recon icon' />
			),
			label: t('lastFullScan'),
			value: getFormattedTimestamp(sensorData.data.scanHistory.lastFullScan),
		},
	];

	const systemData: SystemInfo[] = [
		{
			icon: (
				<img
					src={CommunicationIcon}
					className='w-5 h-5 icon-themed'
					alt='communication icon'
				/>
			),
			label: t('connection'),
			value:
				sensorData.data.connectionStatus === 'CONNECTED'
					? t('connected')
					: t('disconnected'),
			isHighlighted: false,
			statusColor: sensorData.data.systemInfo.connectionStatusColor,
		},
		{
			icon: (
				<img
					src={MachineIcon}
					className='w-5 h-5 icon-themed'
					alt='machine icon'
				/>
			),
			label: t('sensorVersion'),
			value: sensorData.data.sensorInfo.version,
		},
		{
			icon: (
				<img
					src={ReplaceFileIcon}
					className='w-5 h-5 icon-themed'
					alt='replace file icon'
				/>
			),
			label: t('lastDbUpdate'),
			value: getFormattedTimestamp(sensorData.data.sensorInfo.lastDbUpdate),
		},
		{
			icon: (
				<img
					src={SensorLastPolicySyncIcon}
					className='w-5 h-5 icon-themed'
					alt='sensor last policy sync icon'
				/>
			),
			label: t('lastPolicySync'),
			value: getFormattedTimestamp(sensorData.data.sensorInfo.lastPolicySync),
		},
	];

	// Action buttons - change based on scan state
	const actionButtons: ActionButton[] = isScanning
		? [
				{ label: t('quickScan'), onClick: startQuickScan, disabled: true },
				{ label: t('stopScan'), onClick: stopScan },
				{ label: t('update'), onClick: updateSensor, disabled: true },
		  ]
		: [
				{ label: t('quickScan'), onClick: startQuickScan },
				{ label: t('fullScan'), onClick: startFullScan },
				{ label: t('update'), onClick: updateSensor },
		  ];

	// Check if we should show minimal view (only for DECOMMISSIONED and ARCHIVED)
	const isMinimalView =
		sensorData.data.machineStatus === 'DECOMMISSIONED' ||
		sensorData.data.machineStatus === 'ARCHIVED';

	return (
		<>
			<ThemeToggle />
			<LanguageToggle />
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
				Toggle Status ({sensorData.data.machineStatus})
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
				<StatusCard status={sensorData.data.machineStatus} />

				{/* Show full interface only when not in minimal view */}
				{!isMinimalView && (
					<>
						<ScanInfoSection scanData={scanData} />
						<SystemInfoSection systemData={systemData} />

						{/* Full Scan Progress Section - Show when scan is running */}
						{isScanning && currentScan && (
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
										{t('runningFullScan')}
									</h2>

									{/* Progress Bar */}
									<div className='w-full bg-gray-300 rounded-full h-3 mb-4 overflow-hidden'>
										<div
											className='h-full rounded-full transition-all duration-300 ease-out'
											style={{
												width: `${Math.floor(currentScan.progress)}%`,
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
										{Math.floor(currentScan.progress)}% - {t('startedAt')}{' '}
										{getFormattedTimestamp(currentScan.startTime)}
									</div>
								</div>
							</div>
						)}

						<ActionButtons buttons={actionButtons} />
					</>
				)}
			</div>

			{/* C# Debug Panel - Show only in development */}
			{import.meta.env.DEV && (
				<div className='mt-6'>
					<CSharpDebug />
				</div>
			)}
		</>
	);
};
