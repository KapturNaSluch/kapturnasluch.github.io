// Resources + About page builder
/* global TRANSLATIONS, currentLang, currentScope, translate */

// Translation table access

function getTranslationTable() {
	const source = (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS) || null;
	if (!source) {
		return {};
	}

	const lang = currentLang === "pl" ? "pl" : "en";
	const picked = lang === "pl" ? source.pl : source.en;
	return picked || source.en || {};
}

// Generic index helpers (used by both Resources and About pages)

// Collects unique numeric indices found under `prefix` + `<n>` + `suffix`.
function collectIndices(prefix, suffix, filterSection) {
	const table = getTranslationTable();
	const idxs = new Set();

	if (!/^[A-Za-z0-9_()\\+]+$/.test(prefix) || !/^[A-Za-z0-9_()\\+]+$/.test(suffix)) {
		throw new Error("collectIndices: unsafe prefix/suffix");
	}

	const re = new RegExp(`^${prefix}(\\d+)${suffix}$`);

	for (const key of Object.keys(table)) {
		const m = key.match(re);
		if (!m) {
			continue;
		}
		const sectionNum = Number(m[1]);
		const cardNum = m[2] !== undefined ? Number(m[2]) : undefined;

		// When filterSection is given, keep only matches for that section.
		if (filterSection !== undefined && Number(m[1]) !== filterSection) {
			continue;
		}

		idxs.add(cardNum !== undefined ? cardNum : sectionNum);
	}

	return [...idxs].sort((a, b) => a - b);
}

function resourceSectionIndices() {
	return collectIndices("rsrc_", "_name");
}

function resourceCardIndices(sectionIdx) {
	return collectIndices("rsrc_", "_(\\d+)_title", Number(sectionIdx));
}

function categoryIndices() {
	return collectIndices("qa_", "_name");
}

function questionIndicesFor(categoryIdx) {
	return collectIndices("qa_", "_(\\d+)_q", Number(categoryIdx));
}

// Shared DOM helpers

// Anchor id derived from the English name so it stays stable across languages.
function slugFor(base, fallback) {
	const englishName = translate(base, "en");
	return (
		englishName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "") || fallback
	);
}

function createSectionBase(idBase, nameKey, fallbackId, descKey) {
	const section = document.createElement("section");
	section.className = "cat-section";
	section.id = slugFor(nameKey, fallbackId);

	const label = document.createElement("a");
	label.className = "cat-label";
	label.href = `#${section.id}`;
	label.textContent = translate(nameKey);
	section.appendChild(label);

	if (descKey) {
		const desc = translate(descKey);
		if (desc) {
			const p = document.createElement("p");
			p.className = "cat-desc";
			p.textContent = desc;
			section.appendChild(p);
		}
	}

	return section;
}

// Renders either trusted HTML (controlled translation strings) or plain text
// into `el`. The HTML branch goes through the Trusted-Types-backed sink
// in locale.js; the text branch uses textContent (never parsed).
function setContent(el, content) {
	if (typeof content !== "string") {
		el.textContent = String(content ?? "");
		return;
	}

	if (/<[a-z][\s\S]*>/i.test(content)) {
		window.setTrustedHtml(el, content);
	} else {
		el.textContent = content;
	}
}

function setHeaderText(h1Key, pKey) {
	const h1 = document.querySelector(".page-header h1");
	if (h1) {
		h1.textContent = translate(h1Key);
	}

	const p = document.querySelector(".page-header p");
	if (p) {
		p.textContent = translate(pKey);
	}
}

function finalize(main) {
	window.processIconSpans?.(main);
	window.processResIcons?.(main);
	window.applyTranslations?.();
}

// Resources page

function isCardNew(table, base, timeout = 7 * 24 * 60 * 60) {
	const newSince = Number(table[`${base}_date`] ?? 0);
	const nowSec = Math.floor(Date.now() / 1000);

	return (
		Number.isFinite(newSince) &&
		newSince > 0 &&
		newSince <= nowSec &&
		(nowSec - newSince) < timeout // in seconds
	);
}

function buildResCard(sectionIdx, cardIdx) {
	const base = `rsrc_${sectionIdx}_${cardIdx}`;
	const table = getTranslationTable();

	const card = document.createElement("a");
	card.href = translate(`${base}_url`) || "#";
	card.target = "_blank";
	card.rel = "noopener noreferrer";
	card.className = "res-card";

	const head = document.createElement("div");
	head.className = "res-card-head";

	const iconSpan = document.createElement("span");
	iconSpan.className = "res-icon";
	iconSpan.textContent = translate(`${base}_emote`) || "";
	head.appendChild(iconSpan);

	if (isCardNew(table, base)) {
		const badge = document.createElement("span");
		badge.className = "badge-new";
		badge.setAttribute("data-i18n", "rsrc_date");
		badge.textContent = "new";
		head.appendChild(badge);
	}

	card.appendChild(head);

	const title = translate(`${base}_title`);
	if (title) {
		const titleEl = document.createElement("div");
		titleEl.className = "res-title";
		titleEl.textContent = title;
		card.appendChild(titleEl);
	}

	const subtitle = translate(`${base}_subtitle`);
	if (subtitle) {
		const subEl = document.createElement("div");
		subEl.className = "res-desc";
		subEl.style.opacity = "0.75";
		subEl.textContent = subtitle;
		card.appendChild(subEl);
	}

	const desc = translate(`${base}_desc`);
	if (desc) {
		const descEl = document.createElement("div");
		descEl.className = "res-desc";
		setContent(descEl, desc);
		card.appendChild(descEl);
	}

	return card;
}

function buildResSection(sectionIdx) {
	const section = createSectionBase(
		`rsrc_${sectionIdx}`,
		`rsrc_${sectionIdx}_name`,
		`section-${sectionIdx}`
	);

	const grid = document.createElement("div");
	grid.className = "res-grid";

	for (const cardIdx of resourceCardIndices(sectionIdx)) {
		grid.appendChild(buildResCard(sectionIdx, cardIdx));
	}

	section.appendChild(grid);
	return section;
}

function populatePageResources() {
	const main = document.querySelector("main.content");
	if (!main) {
		return;
	}

	setHeaderText("rsrc_title", "rsrc_desc");
	main.replaceChildren(...resourceSectionIndices().map(buildResSection));
	finalize(main);
}

// About page

function buildQaArticle(categoryIdx, questionIdx) {
	const base = `qa_${categoryIdx}_${questionIdx}`;

	const details = document.createElement("details");
	details.className = "qa";

	const summary = document.createElement("summary");
	summary.className = "qa-q";

	const text = document.createElement("span");
	text.className = "qa-q-text";
	text.textContent = translate(`${base}_q`);
	summary.appendChild(text);
	details.appendChild(summary);

	const a = translate(`${base}_a`);
	if (a) {
		const body = document.createElement("div");
		body.className = "qa-a";

		// Wrap plain text in <p> so <details> indentation behaves correctly
		if (/<[a-z][\s\S]*>/i.test(a)) {
			window.setTrustedHtml(body, a);
		} else {
			const p = document.createElement("p");
			p.textContent = a;
			body.appendChild(p);
		}

		details.appendChild(body);
	}

	return details;
}

function buildAboutSection(categoryIdx) {
	const section = createSectionBase(
		`qa_${categoryIdx}`,
		`qa_${categoryIdx}_name`,
		`section-${categoryIdx}`,
		`qa_${categoryIdx}_desc`
	);

	questionIndicesFor(categoryIdx).forEach(idx2 => {
		section.appendChild(buildQaArticle(categoryIdx, idx2));
	});

	return section;
}

function populatePageAbout() {
	const main = document.querySelector("main.content");
	if (!main) {
		return;
	}

	setHeaderText("qa_pg_title", "qa_pg_desc");
	main.replaceChildren(...categoryIndices().map(buildAboutSection));
	finalize(main);
}

// Bootstrap - dispatch by scope, rebuild on language toggle

function getBuilder(scope) {
	if (scope === "resources") {
		return populatePageResources;
	}

	if (scope === "about") {
		return populatePageAbout;
	}

	return null;
}

document.addEventListener("DOMContentLoaded", () => {
	const scope =
		document.documentElement.getAttribute("data-i18n-scope") ??
		(typeof currentScope !== "undefined" ? currentScope : "index");

	const populate = () => {
		const builder = getBuilder(scope);
		if (builder) {
			builder();
		}
	};

	populate();

	const originalToggle = window.toggleLang;
	if (typeof originalToggle === "function") {
		window.toggleLang = function () {
			originalToggle();
			populate();
		};
	}
});