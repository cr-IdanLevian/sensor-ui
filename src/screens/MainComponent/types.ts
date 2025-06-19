export type ConnectionStatus = 'Connected' | 'Disconnected';

export type MachineStatus =
	| 'SECURED'
	| 'AT RISK'
	| 'DECOMMISSIONED'
	| 'ARCHIVED';

export interface ScanInfo {
	icon: JSX.Element;
	label: string;
	value: string;
}

export interface SystemInfo {
	icon: JSX.Element;
	label: string;
	value: string;
	isHighlighted?: boolean;
	statusColor?: string; // for connection status color
}

export interface ActionButton {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
}

export interface ScanProgress {
	percentage: number;
	startTime: string;
	isRunning: boolean;
}
