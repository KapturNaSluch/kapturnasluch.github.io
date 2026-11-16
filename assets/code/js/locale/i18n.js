// Scope resolution and async translation loading
/* exported getHtmlPolicy, loadAllTranslations */

function detectScope() {
	const explicit = document.documentElement.getAttribute("data-i18n-scope");
	if (explicit) {
		return explicit;
	}

	const path = window.location.pathname.replace(/\/+$/, "");
	const segment = path.split("/").filter(Boolean).pop() ?? "";

	// Strip .html extension, treat index.html / empty / file:// root as "index"
	const name = segment.replace(/\.html?$/i, "");
	if (!name || name === "index" || window.location.protocol === "file:") {
		return "index";
	}

	return name;
}

const currentScope = detectScope();
const LOCALE_BASE = "/assets/code/json/locale";

async function fetchJson(url) {
	const r = await fetch(url);

	if (!r.ok) {
		throw new Error(`${r.status} ${url}`);
	}

	return r.json();
}

// Load shared + scoped JSON for one language, merge, inject title fallbacks.
async function loadLang(lang) {
	const [shared, scoped] = await Promise.allSettled([
		fetchJson(`${LOCALE_BASE}/${lang}/shared/data.json`),
		fetchJson(`${LOCALE_BASE}/${lang}/${currentScope}/data.json`),
	]);

	const merged = {
		...(shared.status === "fulfilled" ? shared.value : {}),
		...(scoped.status === "fulfilled" ? scoped.value : {}),
	};

	if (merged.index_page_title == null) {
		merged.index_page_title = merged.nav_home ?? "";
	}

	if (merged.resources_page_title == null) {
		merged.resources_page_title = merged.nav_resources ?? "";
	}

	if (merged.about_page_title == null) {
		merged.about_page_title = merged.nav_about ?? "";
	}

	return merged;
}

// Resolves to { en: {...}, pl: {...}, ... }
async function loadAllTranslations(langs) {
	const entries = await Promise.allSettled(
		langs.map(lang => loadLang(lang).then(data => [lang, data]))
	);

	return Object.fromEntries(
		entries
			.filter(e => e.status === "fulfilled")
			.map(e => e.value)
	);
}

// Trusted Types - kept here since i18n.js loads before locale.js

let _htmlPolicy = null;

function getHtmlPolicy() {
	if (_htmlPolicy !== null) {
		return _htmlPolicy;
	}

	const tt = window.trustedTypes;
	if (tt && typeof tt.createPolicy === "function") {
		try {
			// eslint-disable-next-line no-unsanitized/method
			_htmlPolicy = tt.createPolicy("kns-html", {
				// translations only
				createHTML: (input) => String(input ?? ""),
			});

			return _htmlPolicy;
		} catch (err) {
			console.warn("Trusted Types policy creation failed:", err);
		}
	}

	_htmlPolicy = { createHTML: (input) => String(input ?? "") };

	return _htmlPolicy;
}