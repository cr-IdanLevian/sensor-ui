import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={toggleTheme}
			className='fixed top-4 right-4 z-50 h-10 w-10 rounded-full border backdrop-blur-sm transition-all duration-200'
			style={{
				borderColor: 'var(--color-tokens-design-tokens-borders-appstroke)',
				backgroundColor:
					'var(--color-tokens-design-tokens-backgrounds-appsectionbackground)',
				color: 'var(--color-tokens-design-tokens-text-displaysectiontext)',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor =
					'var(--color-tokens-design-tokens-backgrounds-appsectionbackground)';
				e.currentTarget.style.opacity = '0.8';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor =
					'var(--color-tokens-design-tokens-backgrounds-appsectionbackground)';
				e.currentTarget.style.opacity = '1';
			}}
			aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
		>
			{theme === 'dark' ? (
				<Sun
					className='h-5 w-5'
					style={{
						color: 'var(--color-tokens-design-tokens-text-displaysectiontext)',
					}}
				/>
			) : (
				<Moon
					className='h-5 w-5'
					style={{
						color: 'var(--color-tokens-design-tokens-text-displaysectiontext)',
					}}
				/>
			)}
		</Button>
	);
}
