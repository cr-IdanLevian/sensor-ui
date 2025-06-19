export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'sensor-ui-theme';

export function getTheme(): Theme {
	if (typeof window === 'undefined') return 'dark';

	const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
	if (stored && (stored === 'light' || stored === 'dark')) {
		return stored;
	}

	// Check system preference
	if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		return 'light';
	}

	return 'dark';
}

export function setTheme(theme: Theme): void {
	if (typeof window === 'undefined') return;

	localStorage.setItem(THEME_STORAGE_KEY, theme);
	document.documentElement.classList.toggle('dark', theme === 'dark');
	document.documentElement.classList.toggle('light', theme === 'light');
}

export function toggleTheme(): Theme {
	const currentTheme = getTheme();
	const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
	setTheme(newTheme);
	return newTheme;
}
