import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MainComponent } from './screens/MainComponent';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<LanguageProvider>
			<ThemeProvider>
				<MainComponent />
			</ThemeProvider>
		</LanguageProvider>
	</StrictMode>
);
