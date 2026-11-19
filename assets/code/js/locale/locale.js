// Locale runtime - depends on i18n.js (loadAllTranslations, getHtmlPolicy, LOCALE_BASE)
/* global loadAllTranslations, getHtmlPolicy, LOCALE_BASE */

// Trusted HTML insertion

let _langEmojis = new Map();

let _translationsMap = new Map();

function setTrustedHtml(el, content) {
	const text = content == null ? "" : String(content);

	if (typeof el.setHTMLUnsafe === "function") {
		el.setHTMLUnsafe(text); // eslint-disable-next-line no-unsanitized/method
		return;
	}

	const range = document.createRange();
	range.selectNodeContents(el);
	const trusted = getHtmlPolicy().createHTML(text);

	const frag = range.createContextualFragment(trusted); // eslint-disable-next-line no-unsanitized/method

	el.replaceChildren(frag);
}

function isHtmlString(str) {
	return /<[a-z][\s\S]*>/i.test(str);
}

window.isHtmlString = isHtmlString;

// Language resolution

const FALLBACK_LANG = "en";

let _supportedLangs = [];

function matchLang(tag) {
	if (!tag || _supportedLangs.length === 0) {
		return null;
	}

	const lower = tag.toLowerCase();

	return _supportedLangs.find(l => lower.startsWith(l)) ?? null;
}

function detectLang() {
	const saved = localStorage.getItem("lang");
	if (matchLang(saved)) {
		return matchLang(saved);
	}

	const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
	for (const tag of langs) {
		const match = matchLang(tag);
		if (match) {
			return match;
		}
	}

	return FALLBACK_LANG;
}

let _currentLang = FALLBACK_LANG;

function getLang() {
	return _currentLang;
}

window.getLang = getLang;
window.setLang = function(lang) {
	const resolved = matchLang(lang);
	if (!resolved || resolved === _currentLang) {
		return;
	}

	_currentLang = resolved;
	localStorage.setItem("lang", resolved);

	applyTranslations();
	window.onTranslationsReady?.();

	buildLangDropdown();
};

window.toggleLang = function() {
	const idx  = _supportedLangs.indexOf(_currentLang);
	const next = _supportedLangs[(idx + 1) % _supportedLangs.length];

	window.setLang(next);
};

function langFlag(bcp47) {
	const emoji = _langEmojis.get(bcp47);
	if (emoji) {
		return emoji;
	}

	const region = bcp47.includes("-")
		? bcp47.split("-")[1].toUpperCase()
		: bcp47.toUpperCase();

	return Array.from(region)
		.map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)))
		.join("");
}

function langTitle(bcp47) {
	try {
		const dn = new Intl.DisplayNames([_currentLang, "en"], { type: "language" });
		let val = dn.of(bcp47) ?? bcp47;

		return String(val).capitalize();
	} catch {
		return bcp47;
	}
}

// Translation lookup

function getLangTable(lang) {
	return _translationsMap.get(lang) ?? null;
}

function lookupEntry(key, lang) {
	const table = getLangTable(lang);
	if (!table || !Object.hasOwn(table, key)) {
		return undefined;
	}

	return Object.getOwnPropertyDescriptor(table, key)?.value;
}

function translate(key, forceLang = null, fallback = FALLBACK_LANG, on_empty = "", on_undefined = "") {
	const requestedLang = forceLang || _currentLang;
	const lang         = matchLang(requestedLang) || FALLBACK_LANG;
	const fallbackLang = matchLang(fallback)      || FALLBACK_LANG;

	const primaryVal = lookupEntry(key, lang);
	const backupVal  = lookupEntry(key, fallbackLang);

	if (primaryVal === undefined && backupVal === undefined) {
		return typeof on_undefined === "function" ? on_undefined(key, lang, fallbackLang) : on_undefined;
	}

	let value = primaryVal !== undefined ? primaryVal : backupVal;

	if (value == null || value === "") {
		return typeof on_empty === "function" ? on_empty(key, lang, fallbackLang, value) : on_empty;
	}

	value = String(value);
	value = value.replace(/ - /g, " - ");

	return value;
}

// Lang dropdown

function buildLangDropdown() {
	const dropdown = document.querySelector(".lang-dropdown");
	if (!dropdown) {
		return;
	}

	dropdown.replaceChildren();

	for (const lang of _supportedLangs) {
		const btn       = document.createElement("button");
		const shortcode = langFlag(lang);
		const title     = langTitle(lang);

		btn.setAttribute("role", "option");
		btn.setAttribute("title", title);
		btn.dataset.lang = lang;
		btn.className = "lang-option" + (lang === _currentLang ? " active" : "");

		const span = document.createElement("span");
		span.className = "lang-icon";
		span.textContent = shortcode;
		btn.appendChild(span);

		btn.onclick = () => {
			window.setLang(lang);
			closeLangPicker();
		};

		dropdown.appendChild(btn);
	}

	window.processIconSpans?.(dropdown);
}

function updateLangButtonIcon() {
	const btn = document.querySelector(".lang-picker .lang-toggle");
	if (!btn) {
		return;
	}

	const span = btn.querySelector(".lang-icon") || btn;
	window.renderShortcode?.(span, langFlag(_currentLang));
}

window.toggleLangPicker = function() {
	document.querySelector(".lang-picker")?.classList.toggle("open");
};

function closeLangPicker() {
	document.querySelector(".lang-picker")?.classList.remove("open");
}

document.addEventListener("click", (e) => {
	if (!e.target.closest(".lang-picker")) {
		closeLangPicker();
	}
});

// Apply translations

function applyTranslations() {
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key   = el.getAttribute("data-i18n");
		const value = translate(key);

		if (isHtmlString(value)) {
			setTrustedHtml(el, value);
		} else {
			el.textContent = value;
		}
	});

	updateLangButtonIcon();
	buildLangDropdown();

	document.documentElement.lang = _currentLang;

	window.updateThemeButtonLabel?.();
	window.setDocumentTitle?.();
}

window.applyTranslations = applyTranslations;

// Init

async function initLocale() {
	let manifest;

	try {
		const r = await fetch(`${LOCALE_BASE}/manifest.json`);
		if (!r.ok) {
			throw new Error(r.status);
		}

		manifest = await r.json();
	} catch (err) {
		console.error("[i18n] Failed to load locale manifest:", err);
		manifest = [FALLBACK_LANG];
	}

	_supportedLangs = Array.isArray(manifest)
		? manifest
		: Object.keys(manifest);

	_langEmojis = new Map(
		Object.entries(Array.isArray(manifest) ? {} : manifest)
	);

	_currentLang = detectLang();

	try {
		const loaded = await loadAllTranslations(_supportedLangs);

		_translationsMap = new Map(Object.entries(loaded));

		window.TRANSLATIONS = loaded;
	} catch (err) {
		console.error("[i18n] Failed to load translations:", err);
	}

	applyTranslations();
	window.onTranslationsReady?.();
}

window.addEventListener("storage", (e) => {
	if (e.key === "lang" && matchLang(e.newValue)) {
		_currentLang = matchLang(e.newValue);
		applyTranslations();
	}
});

let _localeReady = null;
window.localeReady = () => (_localeReady ??= initLocale());
document.addEventListener("DOMContentLoaded", () => {
	window.localeReady();
});