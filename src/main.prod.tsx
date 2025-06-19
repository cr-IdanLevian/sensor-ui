import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Import WebView security measures
import './lib/webview-security';

// Import production component (clean version)
import { MainComponent } from './screens/MainComponent/MainComponent.prod.tsx';

// Import contexts for theme and language
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<LanguageProvider>
				<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800'>
					<MainComponent />
				</div>
			</LanguageProvider>
		</ThemeProvider>
	</StrictMode>
);
