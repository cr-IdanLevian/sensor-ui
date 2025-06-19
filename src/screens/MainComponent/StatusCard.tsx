import endpointProtectionIcon from '@/assets/icon/endpoint-protection.svg';
import alertIcon from '@/assets/icon/alert.svg';
import warningIcon from '@/assets/icon/warning.svg';
import decommissionMachineIcon from '@/assets/icon/decommission-machine.svg';
import archiveMachineIcon from '@/assets/icon/archive-machine.svg';
import { useTheme } from '@/contexts/ThemeContext';
import type { MachineStatus } from './types';

interface StatusCardProps {
	status: MachineStatus;
}

export function StatusCard({ status }: StatusCardProps) {
	const { theme } = useTheme();
	const isAtRisk = status === 'AT RISK';
	const isDecommissioned = status === 'DECOMMISSIONED';
	const isArchived = status === 'ARCHIVED';
	const isWarningStatus = isDecommissioned || isArchived;

	const getStatusIcon = () => {
		if (isAtRisk) {
			return <img src={alertIcon} alt='Alert' className='w-10 h-10' />;
		}
		if (isDecommissioned) {
			return (
				<img
					src={decommissionMachineIcon}
					alt='Decommissioned'
					className='w-10 h-10'
				/>
			);
		}
		if (isArchived) {
			return (
				<img src={archiveMachineIcon} alt='Archived' className='w-10 h-10' />
			);
		}
		return (
			<img
				src={endpointProtectionIcon}
				alt='Endpoint Protection'
				className='w-10 h-10'
				style={{
					filter:
						'brightness(0) saturate(100%) invert(67%) sepia(42%) saturate(427%) hue-rotate(94deg) brightness(97%) contrast(88%)',
				}}
			/>
		);
	};

	const getStatusColor = () => {
		if (isAtRisk) return '#F7667E';
		if (isWarningStatus) return '#EDBC10';
		return 'var(--design-primitives-colors-green-green300)';
	};

	const getBorderColor = () => {
		if (isAtRisk) return '#EF4444';
		if (isWarningStatus) return '#EDBC10';
		return 'var(--design-primitives-colors-green-green300)';
	};

	const getBannerMessage = () => {
		if (isDecommissioned)
			return "This sensor has been decommissioned and it's not protecting the machine.";
		if (isArchived)
			return "This sensor has been archived and it's not protecting the machine.";
		return 'Please contact you support team!';
	};

	const getBannerColors = () => {
		if (isAtRisk) {
			return {
				background: theme === 'light' ? '#FCCCD4' : '#300008',
				textColor: '#F7667E',
			};
		}
		if (isWarningStatus) {
			return {
				background: theme === 'light' ? '#FFEBCC' : '#663100',
				textColor: '#FF9900',
			};
		}
		return { background: '', textColor: '' };
	};

	return (
		<>
			<div
				className='flex flex-col items-center justify-center gap-2 w-full rounded-xl border p-6'
				style={{
					borderColor: getBorderColor(),
					background:
						'var(--color-tokens-design-tokens-backgrounds-appsectionbackground)',
				}}
			>
				<div className='flex items-center gap-2'>
					{getStatusIcon()}
					<div className='flex flex-col items-start gap-1'>
						<span
							className='text-xs font-normal'
							style={{
								color:
									'var(--color-tokens-design-tokens-text-textdefaultcolor)',
							}}
						>
							Machine status
						</span>
						<span
							className='text-xl font-semibold tracking-tight'
							style={{
								color: getStatusColor(),
							}}
						>
							{status}
						</span>
					</div>
				</div>
			</div>

			{/* Alert/Warning Banner for non-SECURED statuses */}
			{(isAtRisk || isWarningStatus) && (
				<div
					style={{
						display: 'flex',
						padding:
							'var(--Spacing---xs, 4px) var(--Spacing---xs, 4px) var(--Spacing---xs, 4px) var(--Spacing---small, 8px)',
						alignItems: 'center',
						gap: 'var(--Spacing---small, 8px)',
						alignSelf: 'stretch',
						borderRadius: 'var(--BorderRadius---small, 4px)',
						background: getBannerColors().background,
						width: '100%',
					}}
				>
					<img
						src={isAtRisk ? warningIcon : alertIcon}
						alt={isAtRisk ? 'Warning' : 'Alert'}
						className='w-5 h-5 flex-shrink-0'
						style={
							isWarningStatus
								? {
										filter:
											'invert(60%) sepia(100%) saturate(1500%) hue-rotate(15deg) brightness(100%) contrast(100%)',
								  }
								: {}
						}
					/>
					<span
						className='text-sm font-medium'
						style={{ color: getBannerColors().textColor }}
					>
						{getBannerMessage()}
					</span>
				</div>
			)}
		</>
	);
}
