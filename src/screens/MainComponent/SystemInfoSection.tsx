import type { SystemInfo } from './types';

export function SystemInfoSection({
	systemData,
}: {
	systemData: SystemInfo[];
}) {
	return (
		<div
			className='flex flex-col gap-3 w-full rounded-lg p-4'
			style={{
				background:
					'var(--color-tokens-design-tokens-backgrounds-appsectionbackground)',
			}}
		>
			{systemData.map((item, index) => (
				<div key={index} className='flex items-center justify-between w-full'>
					<div className='flex items-center gap-2'>
						<div
							style={{
								color:
									'var(--color-tokens-design-tokens-text-displaysectiontext)',
							}}
						>
							{item.icon}
						</div>
						<span
							className='text-sm font-bold'
							style={{
								color: item.isHighlighted
									? 'var(--design-primitives-colors-green-green300)'
									: 'var(--color-tokens-design-tokens-text-displaysectiontext)',
							}}
						>
							{item.label}
						</span>
					</div>
					<span
						className='font-normal text-sm'
						style={
							item.statusColor
								? { color: item.statusColor }
								: {
										color: item.isHighlighted
											? 'var(--design-primitives-colors-green-green300)'
											: 'var(--color-tokens-design-tokens-text-textdefaultcolor)',
								  }
						}
					>
						{item.value}
					</span>
				</div>
			))}
		</div>
	);
}
