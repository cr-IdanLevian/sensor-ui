// WebView Security Module
// Disables developer tools, right-click, and other debugging features for production WebView

export function initializeWebViewSecurity() {
	// Only apply security measures in production or when not in development
	if (import.meta.env.DEV) {
		console.log('[Security] Development mode - security measures disabled');
		return;
	}

	console.log('[Security] Initializing WebView security measures');

	// Disable right-click context menu
	document.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		return false;
	});

	// Disable developer tool keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		// F12 - DevTools
		if (e.key === 'F12') {
			e.preventDefault();
			return false;
		}

		// Ctrl+Shift+I - DevTools (Windows/Linux)
		if (e.ctrlKey && e.shiftKey && e.key === 'I') {
			e.preventDefault();
			return false;
		}

		// Cmd+Shift+I - DevTools (Mac)
		if (e.metaKey && e.shiftKey && e.key === 'I') {
			e.preventDefault();
			return false;
		}

		// Ctrl+Shift+J - Console (Windows/Linux)
		if (e.ctrlKey && e.shiftKey && e.key === 'J') {
			e.preventDefault();
			return false;
		}

		// Cmd+Shift+J - Console (Mac)
		if (e.metaKey && e.shiftKey && e.key === 'J') {
			e.preventDefault();
			return false;
		}

		// Ctrl+Shift+C - Element Inspector (Windows/Linux)
		if (e.ctrlKey && e.shiftKey && e.key === 'C') {
			e.preventDefault();
			return false;
		}

		// Cmd+Shift+C - Element Inspector (Mac)
		if (e.metaKey && e.shiftKey && e.key === 'C') {
			e.preventDefault();
			return false;
		}

		// Ctrl+Shift+K - Firefox Console (Windows/Linux)
		if (e.ctrlKey && e.shiftKey && e.key === 'K') {
			e.preventDefault();
			return false;
		}

		// Cmd+Shift+K - Firefox Console (Mac)
		if (e.metaKey && e.shiftKey && e.key === 'K') {
			e.preventDefault();
			return false;
		}

		// Ctrl+Shift+E - Firefox Network (Windows/Linux)
		if (e.ctrlKey && e.shiftKey && e.key === 'E') {
			e.preventDefault();
			return false;
		}

		// Cmd+Shift+E - Firefox Network (Mac)
		if (e.metaKey && e.shiftKey && e.key === 'E') {
			e.preventDefault();
			return false;
		}

		// Ctrl+U - View Source (Windows/Linux)
		if (e.ctrlKey && e.key === 'u') {
			e.preventDefault();
			return false;
		}

		// Cmd+U - View Source (Mac)
		if (e.metaKey && e.key === 'u') {
			e.preventDefault();
			return false;
		}

		// Ctrl+S - Save Page (Windows/Linux)
		if (e.ctrlKey && e.key === 's') {
			e.preventDefault();
			return false;
		}

		// Cmd+S - Save Page (Mac)
		if (e.metaKey && e.key === 's') {
			e.preventDefault();
			return false;
		}

		// Ctrl+P - Print (Windows/Linux)
		if (e.ctrlKey && e.key === 'p') {
			e.preventDefault();
			return false;
		}

		// Cmd+P - Print (Mac)
		if (e.metaKey && e.key === 'p') {
			e.preventDefault();
			return false;
		}

		// Ctrl+A - Select All (Windows/Linux)
		if (e.ctrlKey && e.key === 'a') {
			e.preventDefault();
			return false;
		}

		// Cmd+A - Select All (Mac)
		if (e.metaKey && e.key === 'a') {
			e.preventDefault();
			return false;
		}

		// Additional Mac-specific shortcuts
		// Cmd+Option+I - DevTools (Mac Safari/Chrome alternative)
		if (e.metaKey && e.altKey && e.key === 'I') {
			e.preventDefault();
			return false;
		}

		// Cmd+Option+J - Console (Mac Safari/Chrome alternative)
		if (e.metaKey && e.altKey && e.key === 'J') {
			e.preventDefault();
			return false;
		}

		// Cmd+Option+C - Element Inspector (Mac Safari/Chrome alternative)
		if (e.metaKey && e.altKey && e.key === 'C') {
			e.preventDefault();
			return false;
		}

		// Cmd+R - Refresh (Mac)
		if (e.metaKey && e.key === 'r') {
			e.preventDefault();
			return false;
		}

		// Cmd+Shift+R - Hard Refresh (Mac)
		if (e.metaKey && e.shiftKey && e.key === 'R') {
			e.preventDefault();
			return false;
		}

		// Ctrl+R - Refresh (Windows/Linux)
		if (e.ctrlKey && e.key === 'r') {
			e.preventDefault();
			return false;
		}

		// Ctrl+Shift+R - Hard Refresh (Windows/Linux)
		if (e.ctrlKey && e.shiftKey && e.key === 'R') {
			e.preventDefault();
			return false;
		}

		// F5 - Refresh
		if (e.key === 'F5') {
			e.preventDefault();
			return false;
		}

		// Ctrl+F5 - Hard Refresh (Windows/Linux)
		if (e.ctrlKey && e.key === 'F5') {
			e.preventDefault();
			return false;
		}
	});

	// Disable text selection
	document.addEventListener('selectstart', (e) => {
		e.preventDefault();
		return false;
	});

	// Disable drag and drop
	document.addEventListener('dragstart', (e) => {
		e.preventDefault();
		return false;
	});

	// Disable image dragging specifically
	document.addEventListener('dragstart', (e) => {
		if (e.target instanceof HTMLImageElement) {
			e.preventDefault();
			return false;
		}
	});

	// Clear console periodically (optional - can be removed if too aggressive)
	setInterval(() => {
		if (typeof console !== 'undefined' && console.clear) {
			try {
				console.clear();
			} catch {
				// Ignore errors if console.clear is not available
			}
		}
	}, 5000); // Every 5 seconds

	console.log('[Security] WebView security measures initialized');
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializeWebViewSecurity);
	} else {
		initializeWebViewSecurity();
	}
}
