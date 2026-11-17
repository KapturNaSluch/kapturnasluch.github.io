// Theme management
// Depends on: icons.js (renderShortcode)

const THEME_ICONS = {
	dark:  "line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition|🌑",
	light: "line-md:moon-filled-alt-to-sunny-filled-loop-transition|☀️",
};

function getPreferredTheme() {
	return localStorage.getItem("theme")
		?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
}

let currentTheme = getPreferredTheme();
window.currentTheme = currentTheme;

let _themeInitialized = false;

function applyTheme(theme) {
	currentTheme = theme;
	window.currentTheme = theme;

	if (!_themeInitialized) {
		document.documentElement.setAttribute("data-no-transition", "");
	}

	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem("theme", theme);
	updateThemeButtonLabel();

	if (!_themeInitialized) {
		_themeInitialized = true;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				document.documentElement.removeAttribute("data-no-transition");
			});
		});
	}
}

function updateThemeButtonLabel() {
	const btn = document.getElementsByClassName("theme-toggle")[0];
	if (!btn) {
		return;
	}

	const span = btn.querySelector(".theme-icon") || btn;
	const shortcode = currentTheme === "dark" ? THEME_ICONS.light : THEME_ICONS.dark;

	btn.title = currentTheme === "dark" ? "Switch to light" : "Switch to dark";

	window.renderShortcode?.(span, shortcode);
}

window.updateThemeButtonLabel = updateThemeButtonLabel;

window.toggleTheme = function() {
	applyTheme(currentTheme === "dark" ? "light" : "dark");
};

window.addEventListener("storage", (e) => {
	if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
		applyTheme(e.newValue);
	}
});