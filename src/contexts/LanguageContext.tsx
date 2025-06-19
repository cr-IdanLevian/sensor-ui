import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ja' | 'he';

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
	isRTL: boolean;
	formatDate: (date: Date | string) => string;
	formatTime: (date: Date) => string;
}

const translations = {
	en: {
		// Header
		cybereason: 'cybereason',

		// Status
		machineStatus: 'Machine status',
		secured: 'SECURED',
		atRisk: 'AT RISK',
		decommissioned: 'DECOMMISSIONED',
		archived: 'ARCHIVED',

		// Alert messages
		contactSupport: 'Please contact you support team!',
		sensorDecommissioned:
			"This sensor has been decommissioned and it's not protecting the machine.",
		sensorArchived:
			"This sensor has been archived and it's not protecting the machine.",

		// Scan section
		lastQuickScan: 'Last quick scan',
		lastFullScan: 'Last full scan',

		// System section
		connection: 'Connection',
		connected: 'Connected',
		disconnected: 'Disconnected',
		sensorVersion: 'Sensor version',
		lastDbUpdate: 'Last DB update',
		lastPolicySync: 'Last policy sync',

		// Progress
		runningFullScan: 'Running full scan',
		startedAt: 'Started at',

		// Buttons
		quickScan: 'Quick Scan',
		fullScan: 'Full Scan',
		stopScan: 'Stop Scan',
		update: 'Update',

		// Toggle button
		toggleLanguage: 'Toggle Language',
	},
	ja: {
		// Header
		cybereason: 'cybereason',

		// Status
		machineStatus: 'マシンステータス',
		secured: 'セキュア',
		atRisk: 'リスクあり',
		decommissioned: '廃止済み',
		archived: 'アーカイブ済み',

		// Alert messages
		contactSupport: 'サポートチームにお問い合わせください！',
		sensorDecommissioned:
			'このセンサーは廃止されており、マシンを保護していません。',
		sensorArchived:
			'このセンサーはアーカイブされており、マシンを保護していません。',

		// Scan section
		lastQuickScan: '最新クイックスキャン',
		lastFullScan: '最新フルスキャン',

		// System section
		connection: '接続',
		connected: '接続済み',
		disconnected: '切断済み',
		sensorVersion: 'センサーバージョン',
		lastDbUpdate: '最新DB更新',
		lastPolicySync: '最新ポリシー同期',

		// Progress
		runningFullScan: 'フルスキャン実行中',
		startedAt: '開始時刻',

		// Buttons
		quickScan: 'クイックスキャン',
		fullScan: 'フルスキャン',
		stopScan: 'スキャン停止',
		update: '更新',

		// Toggle button
		toggleLanguage: '言語切替',
	},
	he: {
		// Header
		cybereason: 'cybereason',

		// Status
		machineStatus: 'סטטוס המכונה',
		secured: 'מאובטח',
		atRisk: 'בסיכון',
		decommissioned: 'הוצא משימוש',
		archived: 'בארכיון',

		// Alert messages
		contactSupport: 'אנא פנה לצוות התמיכה!',
		sensorDecommissioned: 'החיישן הזה הוצא משימוש ואינו מגן על המכונה.',
		sensorArchived: 'החיישן הזה נשמר בארכיון ואינו מגן על המכונה.',

		// Scan section
		lastQuickScan: 'סריקה מהירה אחרונה',
		lastFullScan: 'סריקה מלאה אחרונה',

		// System section
		connection: 'חיבור',
		connected: 'מחובר',
		disconnected: 'מנותק',
		sensorVersion: 'גרסת החיישן',
		lastDbUpdate: 'עדכון DB אחרון',
		lastPolicySync: 'סנכרון מדיניות אחרון',

		// Progress
		runningFullScan: 'מריץ סריקה מלאה',
		startedAt: 'התחיל ב',

		// Buttons
		quickScan: 'סריקה מהירה',
		fullScan: 'סריקה מלאה',
		stopScan: 'עצור סריקה',
		update: 'עדכן',

		// Toggle button
		toggleLanguage: 'החלף שפה',
	},
};

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState<Language>('he');

	const isRTL = language === 'he';

	// Apply RTL/LTR direction to document
	useEffect(() => {
		document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
		document.documentElement.lang = language;
	}, [language, isRTL]);

	const t = (key: string): string => {
		return (
			translations[language][
				key as keyof (typeof translations)[typeof language]
			] || key
		);
	};

	const getLocaleString = (): string => {
		switch (language) {
			case 'he':
				return 'he-IL';
			case 'ja':
				return 'ja-JP';
			case 'en':
			default:
				return 'en-US';
		}
	};

	const formatDate = (date: Date | string): string => {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		const locale = getLocaleString();

		return (
			dateObj.toLocaleDateString(locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			}) +
			' ' +
			dateObj.toLocaleTimeString(locale, {
				hour: '2-digit',
				minute: '2-digit',
				hour12: language === 'en',
			})
		);
	};

	const formatTime = (date: Date): string => {
		const locale = getLocaleString();

		return date.toLocaleTimeString(locale, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: language === 'en',
		});
	};

	const value = {
		language,
		setLanguage,
		t,
		isRTL,
		formatDate,
		formatTime,
	};

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};
