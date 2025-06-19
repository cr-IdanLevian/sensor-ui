import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import { getTheme, setTheme, toggleTheme, type Theme } from '@/lib/theme';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('dark');

	useEffect(() => {
		// Initialize theme on mount
		const initialTheme = getTheme();
		setThemeState(initialTheme);
		setTheme(initialTheme);
	}, []);

	const handleToggleTheme = () => {
		const newTheme = toggleTheme();
		setThemeState(newTheme);
	};

	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		setThemeState(newTheme);
	};

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme: handleToggleTheme,
				setTheme: handleSetTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
