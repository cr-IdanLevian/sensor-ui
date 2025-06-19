export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'sensor-ui-theme';

// Safe localStorage access with error handling for C# WebView
function safeGetLocalStorage(key: string): string | null {
	try {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(key);
	} catch (error) {
		console.warn('[Theme] localStorage access denied, using fallback:', error);
		return null;
	}
}

function safeSetLocalStorage(key: string, value: string): void {
	try {
		if (typeof window === 'undefined') return;
		localStorage.setItem(key, value);
	} catch (error) {
		console.warn(
			'[Theme] localStorage write denied, theme will not persist:',
			error
		);
	}
}

export function getTheme(): Theme {
	if (typeof window === 'undefined') return 'dark';

	const stored = safeGetLocalStorage(THEME_STORAGE_KEY) as Theme;
	if (stored && (stored === 'light' || stored === 'dark')) {
		return stored;
	}

	// Check system preference
	try {
		if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			return 'light';
		}
	} catch (error) {
		console.warn('[Theme] matchMedia not available, using dark theme:', error);
	}

	return 'dark';
}

export function setTheme(theme: Theme): void {
	if (typeof window === 'undefined') return;

	safeSetLocalStorage(THEME_STORAGE_KEY, theme);

	try {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		document.documentElement.classList.toggle('light', theme === 'light');
	} catch (error) {
		console.warn('[Theme] Failed to update document classes:', error);
	}
}

export function toggleTheme(): Theme {
	const currentTheme = getTheme();
	const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
	setTheme(newTheme);
	return newTheme;
}
