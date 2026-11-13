// Theme management
// Depends on: icons.js (processIconSpans)

// Icon shortcodes for the theme toggle button - not translated, not page-scoped
const THEME_ICONS = {
	dark:  "line-md:moon-filled-alt-to-sunny-filled-loop-transition|🌑",
	light: "line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition|☀️",
};

function getPreferredTheme() {
	return localStorage.getItem("theme")
		?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
}

let currentTheme = getPreferredTheme();

function applyTheme(theme) {
	currentTheme = theme;
	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem("theme", theme);
	updateThemeButtonLabel();
}

function updateThemeButtonLabel() {
	const btn = document.getElementsByClassName("theme-toggle")[0];
	if (!btn) {
		return;
	}

	const span = btn.querySelector(".theme-icon") || btn;
	const shortcode = currentTheme === "dark" ? THEME_ICONS.light : THEME_ICONS.dark;

	// Only rebuild if the icon is actually different from what's rendered
	if (span.dataset.currentShortcode === shortcode && span.querySelector("svg, img")) {
		btn.title = currentTheme === "dark" ? "Switch to light" : "Switch to dark";
		return;
	}

	span.replaceChildren();
	span.textContent = shortcode;
	span.dataset.currentShortcode = shortcode;
	span.classList.add("is-loading");

	const processIconSpansFn = window.processIconSpans;
	if (typeof processIconSpansFn !== "function") {
		// Nothing to render icons with - bail out cleanly
		span.classList.remove("is-loading");
		return;
	}

	processIconSpansFn(btn)
		.then(() => {
			if (span.querySelector("svg, img")) {
				span.dataset.currentShortcode = shortcode;
			}
		})
		.finally(() => span.classList.remove("is-loading"));
}

window.toggleTheme = function() {
	applyTheme(currentTheme === "dark" ? "light" : "dark");
};