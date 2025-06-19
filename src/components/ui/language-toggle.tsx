import { useLanguage, type Language } from '@/contexts/LanguageContext';

export function LanguageToggle() {
	const { language, setLanguage, t } = useLanguage();

	const toggleLanguage = () => {
		const languages: Language[] = ['en', 'ja', 'he'];
		const currentIndex = languages.indexOf(language);
		const nextIndex = (currentIndex + 1) % languages.length;
		setLanguage(languages[nextIndex]);
	};

	const getLanguageDisplay = () => {
		switch (language) {
			case 'en':
				return 'EN';
			case 'ja':
				return '日本語';
			case 'he':
				return 'עב';
			default:
				return 'EN';
		}
	};

	return (
		<button
			onClick={toggleLanguage}
			style={{
				position: 'absolute',
				top: '10px',
				right: '70px', // Positioned to the left of the theme toggle
				padding: '8px 12px',
				backgroundColor: '#444',
				color: 'white',
				border: 'none',
				borderRadius: '4px',
				fontSize: '12px',
				cursor: 'pointer',
				zIndex: 1000,
				minWidth: '60px',
			}}
			title={t('toggleLanguage')}
		>
			{getLanguageDisplay()}
		</button>
	);
}
