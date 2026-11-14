// Scope resolution - which translation table is active
// Depends on: translations.js
/* global TRANSLATIONS_SHARED, TRANSLATIONS_INDEX, TRANSLATIONS_RESOURCES, TRANSLATIONS_ABOUT */

// Explicit dispatch avoids bracket-indexing into a scope object.

function getScopeTable(scope) {
	if (scope === "index") {
		return TRANSLATIONS_INDEX;
	}

	if (scope === "resources") {
		return TRANSLATIONS_RESOURCES;
	}

	if (scope === "about") {
		return TRANSLATIONS_ABOUT;
	}

	return null;
}

function detectScope() {
	const explicitScope = document.documentElement.getAttribute("data-i18n-scope");

	if (explicitScope && getScopeTable(explicitScope)) {
		return explicitScope;
	}

	if (/\/resources(\/|$)/i.test(window.location.pathname)) {
		return "resources";
	}

	if (/\/about(\/|$)/i.test(window.location.pathname)) {
		return "about";
	}

	return "index";
}

const currentScope = detectScope();

// Merge shared + page-scoped strings, then inject default page titles.

function pickLang(source, lang) {
	if (!source) {
		return {};
	}

	if (lang === "pl") {
		return source.pl || {};
	}

	return source.en || {};
}

function buildTranslations(lang) {
	const safeLang = lang === "pl" ? "pl" : "en";

	const shared = pickLang(TRANSLATIONS_SHARED, safeLang);
	const scoped = pickLang(getScopeTable(currentScope), safeLang);

	const merged = { ...shared, ...scoped };

	if (merged.index_page_title == null) {
		merged.index_page_title = merged.nav_home != null ? String(merged.nav_home) : "";
	}

	if (merged.resources_page_title == null) {
		merged.resources_page_title = merged.nav_resources != null ? String(merged.nav_resources) : "";
	}

	if (merged.about_page_title == null) {
		merged.about_page_title = merged.nav_about != null ? String(merged.nav_about) : "";
	}

	return merged;
}

const TRANSLATIONS = {
	en: buildTranslations("en"),
	pl: buildTranslations("pl"),
};

// --- Trusted Types ---
//
// Module-scoped cache - no property access on a function object, so static
// analyzers can't mis-attribute an "HTML-typed" return value here.

let _htmlPolicy = null;

function getHtmlPolicy() {
	if (_htmlPolicy !== null) {
		return _htmlPolicy;
	}

	const tt = window.trustedTypes;

	if (tt && typeof tt.createPolicy === "function") {
		try {
			_htmlPolicy = tt.createPolicy("kns-html", {
				// Translation strings only. This policy is the single
				// boundary where plain strings become TrustedHTML — the
				// analyzer flag here is expected and not a vulnerability.
				createHTML: (input) => String(input ?? ""),
			});

			return _htmlPolicy;
		} catch (err) {
			console.warn("Trusted Types policy creation failed:", err);
		}
	}

	// Fallback with the same interface - used only on browsers without
	// Trusted Types support. Functionally identical to a plain string.
	_htmlPolicy = {
		createHTML: (input) => String(input ?? ""),
	};

	return _htmlPolicy;
}