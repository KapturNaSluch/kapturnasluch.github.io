// Locale runtime - uses TRANSLATIONS from i18n.js
/* global TRANSLATIONS, getHtmlPolicy */

// Insert trusted HTML (translation strings are author-controlled) without
// using any raw-HTML sink: prefer the native Sanitizer API's setHTMLUnsafe,
// which is explicitly designed for parsing HTML into an element while
// respecting its content model and Trusted Types.

function setTrustedHtml(el, html) {
	const str = html ?? "";

	// Primary path - native safe-HTML parser (Chrome 124+/FF 125+/Safari 18+).
	// Equivalent to innerHTML in parsing semantics but recognised as a
	// dedicated sink that takes HTML by design.
	if (typeof el.setHTMLUnsafe === "function") {
		el.setHTMLUnsafe(str);
		return;
	}

	// Fallback: Trusted Types + range fragment parsing.
	// TrustedHTML is the correct input type for this sink; the policy
	// guarantees it wraps author-controlled text only.
	const range = document.createRange();
	range.selectNodeContents(el);
	const trusted = getHtmlPolicy().createHTML(str);
	// eslint-disable-next-line no-unsanitized/method -- TrustedHTML from policy
	const frag = range.createContextualFragment(trusted);
	el.replaceChildren(frag);
}

function detectLang() {
	const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
	return nav.startsWith("pl") ? "pl" : "en";
}

let currentLang = detectLang();

// Table lookup narrowed to the only two supported language keys.
function pickTable(source, lang) {
	if (!source) {
		return null;
	}

	if (lang === "pl") {
		return source.pl || null;
	}

	return source.en || null;
}

function translate(key, forceLang = null, fallback = "en", on_empty = "", on_undefined = "") {
	const table = (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS) || {};
	const requestedLang = forceLang || currentLang;
	const lang = requestedLang === "pl" ? "pl" : "en";
	const fallbackLang = fallback === "pl" ? "pl" : "en";

	const primary = pickTable(table, lang);
	const backup = pickTable(table, fallbackLang);

	const inPrimary = primary && Object.hasOwn(primary, key);
	const inBackup = backup && Object.hasOwn(backup, key);

	if (!inPrimary && !inBackup) {
		if (typeof on_undefined === "function") {
			return on_undefined(key, lang, fallbackLang);
		}

		return on_undefined;
	}

	const descriptor = inPrimary
		? Object.getOwnPropertyDescriptor(primary, key)
		: Object.getOwnPropertyDescriptor(backup, key);
	let value = descriptor ? descriptor.value : undefined;

	if (value == null || value === "") {
		if (typeof on_empty === "function") {
			return on_empty(key, lang, fallbackLang, value);
		}

		return on_empty;
	}

	value = String(value);
	value = value.replace(/ - /g, " — ");
	value = value.replace("'", "’");

	return value;
}

// Language button - flag emoji via Twemoji
function setLangButtonContent(btn) {
	if (!btn) {
		return;
	}

	const span = btn.querySelector(".lang-icon") || btn;
	let raw = translate("lang_label");

	const resolveShortcodesFn = window.resolveShortcodes;
	if (typeof resolveShortcodesFn === "function") {
		raw = resolveShortcodesFn(raw);
	}

	const emojiToTwemojiUrlFn = window.emojiToTwemojiUrl;
	const isFlagEmojiFn = window.isFlagEmoji;

	if (
		typeof emojiToTwemojiUrlFn === "function" &&
		typeof isFlagEmojiFn === "function" &&
		isFlagEmojiFn(raw)
	) {
		const img = document.createElement("img");
		img.src = emojiToTwemojiUrlFn(raw);
		img.alt = raw;
		img.className = "btn-flag-icon";
		img.onerror = () => { span.textContent = raw; };
		span.replaceChildren(img);
		return;
	}

	span.replaceChildren();
	span.textContent = raw;

	const processIconSpansFn = window.processIconSpans;
	if (typeof processIconSpansFn === "function") {
		processIconSpansFn(btn);
	}
}

// Apply translations to the page
function applyTranslations() {
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		const value = translate(key);

		if (/<[a-z][\s\S]*>/i.test(value)) {
			setTrustedHtml(el, value);
		} else {
			el.textContent = value;
		}
	});

	const langBtn = document.getElementsByClassName("lang-toggle")[0];
	if (langBtn) {
		setLangButtonContent(langBtn);
	}

	document.documentElement.lang = currentLang;

	const updateThemeButtonLabelFn = window.updateThemeButtonLabel;
	if (typeof updateThemeButtonLabelFn === "function") {
		updateThemeButtonLabelFn();
	}
}

window.toggleLang = function() {
	currentLang = currentLang === "en" ? "pl" : "en";
	applyTranslations();
};

document.addEventListener("DOMContentLoaded", applyTranslations);