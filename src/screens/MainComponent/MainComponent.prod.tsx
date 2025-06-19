import logo from '@/assets/logo.svg';
import logoDark from '@/assets/logo-dark.svg';
import ScanIcon from '@/assets/icon/scan.svg';
import CommunicationIcon from '@/assets/icon/communication.svg';
import ReconIcon from '@/assets/icon/recon.svg';
import MachineIcon from '@/assets/icon/machine.svg';
import ReplaceFileIcon from '@/assets/icon/replace-file.svg';
import SensorLastPolicySyncIcon from '@/assets/icon/sensor-last-policy-sync.svg';

import { StatusCard } from './StatusCard';
import { ScanInfoSection } from './ScanInfoSection';
import { SystemInfoSection } from './SystemInfoSection';
import { ActionButtons } from './ActionButtons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSensorData } from '@/hooks/useSensorData';
import type { ScanInfo, SystemInfo, ActionButton } from './types';

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
		getFormattedTimestamp,
	} = useSensorData();

	// Early return if loading
	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-8'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
					<p>Loading sensor data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center p-8'>
				<div className='text-center text-red-500'>
					<p className='text-lg font-semibold mb-2'>Connection Error</p>
					<p className='text-sm'>{error}</p>
				</div>
			</div>
		);
	}

	if (!sensorData) {
		return (
			<div className='flex items-center justify-center p-8'>
				<div className='text-center'>
					<p>No sensor data available</p>
				</div>
			</div>
		);
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
		<div
			className='flex flex-col w-[404px] items-center gap-6 p-6 relative rounded-3xl border shadow-xl'
			style={{
				background:
					'var(--color-tokens-design-tokens-backgrounds-appbackground)',
				borderColor: 'var(--color-tokens-design-tokens-borders-appstroke)',
				boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
			}}
		>
			{/* Header with logo */}
			<header className='flex items-start justify-center gap-6 w-full'>
				<img
					className='w-[184px] h-10'
					alt='cybereason'
					src={theme === 'light' ? logoDark : logo}
				/>
			</header>

			{/* Machine status card */}
			<StatusCard status={sensorData.data.machineStatus} />

			{/* Show full interface only when not in minimal view */}
			{!isMinimalView && (
				<>
					{/* Scan information section */}
					<ScanInfoSection scanData={scanData} />

					{/* System information section */}
					<SystemInfoSection systemData={systemData} />

					{/* Scan progress section - Show when scan is running */}
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
									{currentScan.type === 'QUICK'
										? t('runningQuickScan')
										: t('runningFullScan')}
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

					{/* Action buttons */}
					<ActionButtons buttons={actionButtons} />
				</>
			)}
		</div>
	);
};
