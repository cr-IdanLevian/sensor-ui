import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import { getTheme, setTheme, toggleTheme, type Theme } from '@/lib/theme';
import CSharpHostService from '@/services/csharpHost';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
	isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('dark');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch theme from C# server on mount
		const fetchThemeFromCSharp = async () => {
			try {
				setIsLoading(true);
				const themeFromCSharp = await CSharpHostService.getTheme();

				// Validate that the returned theme is supported
				const supportedThemes: Theme[] = ['light', 'dark'];
				const normalizedTheme = themeFromCSharp.toLowerCase() as Theme;

				if (supportedThemes.includes(normalizedTheme)) {
					setTheme(normalizedTheme);
					setThemeState(normalizedTheme);
					console.log(`[Theme] Theme set from C# server: ${normalizedTheme}`);
				} else {
					console.warn(
						`[Theme] Unsupported theme from C# server: ${themeFromCSharp}, falling back to dark`
					);
					const fallbackTheme = getTheme(); // Use local fallback logic
					setTheme(fallbackTheme);
					setThemeState(fallbackTheme);
				}
			} catch (error) {
				console.error('[Theme] Error fetching theme from C# server:', error);
				const fallbackTheme = getTheme(); // Use local fallback logic
				setTheme(fallbackTheme);
				setThemeState(fallbackTheme);
			} finally {
				setIsLoading(false);
			}
		};

		fetchThemeFromCSharp();
	}, []);

	const handleToggleTheme = async () => {
		const newTheme = toggleTheme();
		setThemeState(newTheme);

		// Save to C# server
		try {
			await CSharpHostService.setTheme(newTheme);
			console.log(`[Theme] Theme saved to C# server: ${newTheme}`);
		} catch (error) {
			console.error('[Theme] Error saving theme to C# server:', error);
		}
	};

	const handleSetTheme = async (newTheme: Theme) => {
		setTheme(newTheme);
		setThemeState(newTheme);

		// Save to C# server
		try {
			await CSharpHostService.setTheme(newTheme);
			console.log(`[Theme] Theme saved to C# server: ${newTheme}`);
		} catch (error) {
			console.error('[Theme] Error saving theme to C# server:', error);
		}
	};

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme: handleToggleTheme,
				setTheme: handleSetTheme,
				isLoading,
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
