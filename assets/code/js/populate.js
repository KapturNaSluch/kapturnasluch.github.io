// Resources page
/* global TRANSLATIONS, currentLang, currentScope, translate */

// Safe access to the active translation table - never indexes with a
// user-controlled string; picks between the two known language keys.
function getTranslationTable() {
	const source = (typeof TRANSLATIONS !== "undefined" && TRANSLATIONS) || null;
	if (!source) {
		return {};
	}

	const lang = currentLang === "pl" ? "pl" : "en";
	const picked = lang === "pl" ? source.pl : source.en;
	return picked || source.en || {};
}

function resourceSectionIndices() {
	const table = getTranslationTable();
	const idxs = new Set();

	for (const key of Object.keys(table)) {
		const m = key.match(/^rsrc_(\d+)_name$/);
		if (m) {
			idxs.add(Number(m[1]));
		}
	}

	return [...idxs].sort((a, b) => a - b);
}

function resourceCardIndices(sectionIdx) {
	const table = getTranslationTable();
	const idxs = new Set();
	const target = Number(sectionIdx);

	if (!Number.isFinite(target)) {
		return [];
	}

	for (const key of Object.keys(table)) {
		const m = key.match(/^rsrc_(\d+)_(\d+)_title$/);
		if (m && Number(m[1]) === target) {
			idxs.add(Number(m[2]));
		}
	}

	return [...idxs].sort((a, b) => a - b);
}

function isCardNew(table, base, timeout = 7 * 24 * 60 * 60) {
	const newSince = Number(table[`${base}_new`] ?? 0);
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

	const href     = translate(`${base}_href`)  || "#";
	const emote    = translate(`${base}_emote`) || "";
	const title    = translate(`${base}_title`) || "";
	const subtitle = translate(`${base}_subtitle`) || "";
	const desc     = translate(`${base}_desc`) || "";

	const isNew = isCardNew(table, base);

	const card = document.createElement("a");
	card.href = href;
	card.target = "_blank";
	card.rel = "noopener noreferrer";
	card.className = "res-card";

	const head = document.createElement("div");
	head.className = "res-card-head";

	const iconSpan = document.createElement("span");
	iconSpan.className = "res-icon";
	iconSpan.textContent = emote;
	head.appendChild(iconSpan);

	if (isNew) {
		const badge = document.createElement("span");
		badge.className = "badge-new";
		badge.setAttribute("data-i18n", "rsrc_new");
		badge.textContent = "new";
		head.appendChild(badge);
	}

	card.appendChild(head);

	if (title) {
		const titleEl = document.createElement("div");
		titleEl.className = "res-title";
		titleEl.textContent = title;
		card.appendChild(titleEl);
	}

	if (subtitle) {
		const subEl = document.createElement("div");
		subEl.className = "res-desc";
		subEl.style.opacity = "0.75";
		subEl.textContent = subtitle;
		card.appendChild(subEl);
	}

	if (desc) {
		const descEl = document.createElement("div");
		descEl.className = "res-desc";

		if (/<[a-z][\s\S]*>/i.test(desc)) {
			window.setTrustedHtml(descEl, desc);
		} else {
			descEl.textContent = desc;
		}

		card.appendChild(descEl);
	}

	return card;
}

function buildResSection(sectionIdx) {
	const section = document.createElement("section");
	section.className = "cat-section";

	const name = translate(`rsrc_${sectionIdx}_name`);

	// Anchor id derived from the English name so it stays stable across languages
	const englishName = translate(`rsrc_${sectionIdx}_name`, "en");
	const slug = englishName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "") || `section-${sectionIdx}`;

	section.id = slug;

	const label = document.createElement("a");
	label.className = "cat-label";
	label.href = `#${slug}`;
	label.textContent = name;
	section.appendChild(label);

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

	const h1 = document.querySelector(".page-header h1");
	if (h1) {
		h1.textContent = translate("rsrc_title");
	}

	const p = document.querySelector(".page-header p");
	if (p) {
		p.textContent = translate("rsrc_desc");
	}

	main.replaceChildren(...resourceSectionIndices().map(buildResSection));

	window.processIconSpans?.(main);
	window.processResIcons?.(main);
	window.applyTranslations?.();
}

// About page

function categoryIndices() {
	const table = getTranslationTable();
	const idxs = new Set();

	for (const key of Object.keys(table)) {
		const m = key.match(/^qa_(\d+)_name$/);
		if (m) {
			idxs.add(Number(m[1]));
		}
	}

	return [...idxs].sort((a, b) => a - b);
}

function questionIndicesFor(categoryIdx) {
	const table = getTranslationTable();
	const idxs = new Set();
	const target = Number(categoryIdx);

	if (!Number.isFinite(target)) {
		return [];
	}

	for (const key of Object.keys(table)) {
		const m = key.match(/^qa_(\d+)_(\d+)_q$/);
		if (m && Number(m[1]) === target) {
			idxs.add(Number(m[2]));
		}
	}

	return [...idxs].sort((a, b) => a - b);
}

function buildQaArticle(categoryIdx, questionIdx) {
	const base = `qa_${categoryIdx}_${questionIdx}`;
	const q = translate(`${base}_q`);
	const a = translate(`${base}_a`);

	const details = document.createElement("details");
	details.className = "qa";

	const summary = document.createElement("summary");
	summary.className = "qa-q";

	const text = document.createElement("span");
	text.className = "qa-q-text";
	text.textContent = q;
	summary.appendChild(text);

	details.appendChild(summary);

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
	const section = document.createElement("section");
	section.className = "cat-section";

	const name = translate(`qa_${categoryIdx}_name`);

	// Anchor id derived from the English name so it stays stable across languages
	const englishName = translate(`qa_${categoryIdx}_name`, "en");
	const slug = englishName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "") || `section-${categoryIdx}`;

	section.id = slug;

	const label = document.createElement("a");
	label.className = "cat-label";
	label.href = `#${slug}`;
	label.textContent = name;
	section.appendChild(label);

	const desc = translate(`qa_${categoryIdx}_desc`);
	if (desc) {
		const p = document.createElement("p");
		p.className = "cat-desc";
		p.textContent = desc;
		section.appendChild(p);
	}

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

	const h1 = document.querySelector(".page-header h1");
	if (h1) {
		h1.textContent = translate("qa_pg_title");
	}

	const p = document.querySelector(".page-header p");
	if (p) {
		p.textContent = translate("qa_pg_desc");
	}

	main.replaceChildren(...categoryIndices().map(buildAboutSection));

	window.processIconSpans?.(main);
	window.processResIcons?.(main);
	window.applyTranslations?.();
}

// Bootstrap - dispatch by scope, rebuild on language toggle

document.addEventListener("DOMContentLoaded", () => {
	const scope = document.documentElement.getAttribute("data-i18n-scope")
		?? (typeof currentScope !== "undefined" ? currentScope : "index");

	const populate = () => {
		if (scope === "resources") {
			populatePageResources();
		}

		if (scope === "about") {
			populatePageAbout();
		}
	};

	populate();

	const originalToggle = window.toggleLang;
	if (typeof originalToggle === "function") {
		window.toggleLang = function() {
			originalToggle();
			populate();
		};
	}
});