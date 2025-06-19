import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import type { ActionButton } from './types';

export function ActionButtons({ buttons }: { buttons: ActionButton[] }) {
	const { theme } = useTheme();

	return (
		<div className='flex items-center gap-4 w-full mt-2'>
			{buttons.map((button, index) => (
				<Button
					key={index}
					onClick={button.disabled ? undefined : button.onClick}
					disabled={button.disabled}
					className='flex-1 h-10 min-w-24 border rounded-md font-medium text-sm transition-colors duration-150'
					style={{
						borderColor: button.disabled
							? 'var(--color-tokens-components-button-buttonborder)'
							: 'var(--color-tokens-components-button-buttonborder)',
						color: button.disabled
							? theme === 'light'
								? '#999999'
								: '#666666'
							: 'var(--color-tokens-components-button-buttontextcolor)',
						backgroundColor: button.disabled
							? theme === 'light'
								? '#F5F5F5'
								: '#2A2A2A'
							: 'var(--color-tokens-components-button-buttonbackground)',
						cursor: button.disabled ? 'not-allowed' : 'pointer',
						opacity: button.disabled ? 0.5 : 1,
					}}
					onMouseEnter={(e) => {
						if (!button.disabled) {
							if (theme === 'light') {
								e.currentTarget.style.borderColor = '#F7C31C';
								e.currentTarget.style.backgroundColor = '#FDF2CD';
								e.currentTarget.style.color = '#000000';
							} else {
								e.currentTarget.style.borderColor = '#F7C31C';
								e.currentTarget.style.backgroundColor = '#624C01';
								e.currentTarget.style.color = '#FFFFFF';
							}
						}
					}}
					onMouseLeave={(e) => {
						if (!button.disabled) {
							e.currentTarget.style.borderColor =
								'var(--color-tokens-components-button-buttonborder)';
							e.currentTarget.style.backgroundColor =
								'var(--color-tokens-components-button-buttonbackground)';
							e.currentTarget.style.color =
								'var(--color-tokens-components-button-buttontextcolor)';
						}
					}}
					variant='outline'
				>
					{button.label}
				</Button>
			))}
		</div>
	);
}
