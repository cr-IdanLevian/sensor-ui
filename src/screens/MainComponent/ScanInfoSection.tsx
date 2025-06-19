import { useLanguage } from '@/contexts/LanguageContext';
import type { ScanInfo } from './types';

export function ScanInfoSection({ scanData }: { scanData: ScanInfo[] }) {
	const { isRTL } = useLanguage();
	return (
		<div
			className='flex flex-col gap-3 w-full rounded-lg p-4'
			style={{
				background:
					'var(--color-tokens-design-tokens-backgrounds-appsectionbackground)',
			}}
			accessKey='scan-info-section'
		>
			{scanData.map((item, index) => (
				<div
					key={index}
					className={`flex items-center justify-between w-full ${
						isRTL ? 'flex-row' : ''
					}`}
				>
					<div className={`flex items-center gap-2 ${isRTL ? 'flex-row' : ''}`}>
						<div
							style={{
								color:
									'var(--color-tokens-design-tokens-text-displaysectiontext)',
							}}
						>
							{item.icon}
						</div>
						<span
							className='font-semibold text-sm'
							style={{
								color:
									'var(--color-tokens-design-tokens-text-displaysectiontext)',
							}}
						>
							{item.label}
						</span>
					</div>
					<span
						className='text-sm font-normal'
						style={{
							color: 'var(--color-tokens-design-tokens-text-textdefaultcolor)',
						}}
					>
						{item.value}
					</span>
				</div>
			))}
		</div>
	);
}
