// Resources + About page builder
/* global currentScope, translate, resolveStatusCode */

// Translation table access

function getTranslationTable() {
	const source = window.TRANSLATIONS;
	if (!source || typeof source !== "object") {
		return {};
	}

	const lang = typeof window.getLang === "function" ? window.getLang() : "en";
	const map = new Map(Object.entries(source));

	return map.get(lang) ?? map.get("en") ?? {};
}

// safe keyed lookup
let _safeTableCache = null;

function getSafeTable() {
	if (_safeTableCache !== null) {
		return _safeTableCache;
	}

	const src = getTranslationTable();
	const map = new Map();

	for (const [k, v] of Object.entries(src)) {
		if (typeof k !== "string") {
			continue;
		}

		if (typeof v === "string" || typeof v === "number") {
			map.set(k, v);
		}
	}

	_safeTableCache = map;
	return map;
}

function resetSafeTable() {
	_safeTableCache = null;
}

const RE_KEY_SAFE = /^[A-Za-z0-9_]+$/;

function safeGet(map, key) {
	if (typeof key !== "string" || !RE_KEY_SAFE.test(key)) {
		return "";
	}

	const v = map.get(key);
	return typeof v === "string" ? v : "";
}

// Generic index helpers

function escapeRegExp(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectIndices(prefix, suffix, filterSection) {
	const table = getTranslationTable();
	const idxs = new Set();

	if (!/^[A-Za-z0-9_()\\+]+$/.test(prefix) || !/^[A-Za-z0-9_()\\+]+$/.test(suffix)) {
		throw new Error("collectIndices: unsafe prefix/suffix");
	}

	const re = new RegExp(`^${escapeRegExp(prefix)}(\\d+)${escapeRegExp(suffix)}$`);

	for (const key of Object.keys(table)) {
		const m = key.match(re);
		if (!m) {
			continue;
		}
		const sectionNum = Number(m[1]);

		if (filterSection !== undefined && sectionNum !== filterSection) {
			continue;
		}

		idxs.add(sectionNum);
	}

	return [...idxs].sort((a, b) => a - b);
}

function resourceSectionIndices() {
	return collectIndices("rsrc_", "_name");
}

function resourceCardIndices(sectionIdx) {
	const table = getTranslationTable();
	const prefix = `rsrc_${sectionIdx}_`;
	const suffix = "_title";
	const idxs = new Set();

	for (const key of Object.keys(table)) {
		if (!key.startsWith(prefix) || !key.endsWith(suffix)) {
			continue;
		}
		const mid = key.slice(prefix.length, key.length - suffix.length);
		const n = Number(mid);
		if (Number.isInteger(n) && String(n) === mid) {
			idxs.add(n);
		}
	}

	return [...idxs].sort((a, b) => a - b);
}

function categoryIndices() {
	return collectIndices("qa_", "_name");
}

function questionIndicesFor(categoryIdx) {
	const table = getTranslationTable();
	const prefix = `qa_${categoryIdx}_`;
	const suffix = "_q";
	const idxs = new Set();

	for (const key of Object.keys(table)) {
		if (!key.startsWith(prefix) || !key.endsWith(suffix)) {
			continue;
		}
		const mid = key.slice(prefix.length, key.length - suffix.length);
		const n = Number(mid);
		if (Number.isInteger(n) && String(n) === mid) {
			idxs.add(n);
		}
	}

	return [...idxs].sort((a, b) => a - b);
}

// Shared DOM helpers

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

function setContent(el, content) {
	if (typeof content !== "string") {
		el.textContent = String(content ?? "");
		return;
	}

	if (window.isHtmlString?.(content)) {
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

// Populate taglines

function populateHeroTaglines() {
	const container = document.querySelector(".hero-taglines");

	if (!container) {
		return {};
	}

	const table = getTranslationTable();
	const entries = Object.entries(table)
		.filter(([k]) => /^hero_tagline_\d+$/.test(k))
		.sort(([a], [b]) => {
			const n = s => parseInt(s.replace("hero_tagline_", ""), 10);
			return n(a) - n(b);
		});

	if (entries.length === 0) {
		return {};
	}

	container.replaceChildren(
		...entries.map(([key, value]) => {
			const span = document.createElement("span");
			span.setAttribute("data-i18n", key);
			span.textContent = value;
			return span;
		})
	);
}

// Resources page

function getCardDateSec(map, base) {
	const v = map.get(`${base}_date`);
	if (v === undefined) {
		return null;
	}

	const sec = Number(v);

	return Number.isFinite(sec) && sec > 0 ? sec : null;
}

function isCardNew(map, base, timeout = 7 * 24 * 60 * 60) {
	const newSince = getCardDateSec(map, base);
	if (newSince === null) {
		return false;
	}

	const nowSec = Math.floor(Date.now() / 1000);

	// lookahead (min) for future entries
	const GRACE = 5 * 60;
	const age = nowSec - newSince;

	return age < timeout && age > -GRACE;
}

function buildResCard(sectionIdx, cardIdx) {
	// guard the indices
	if (!Number.isInteger(sectionIdx) || sectionIdx < 0 ||
		!Number.isInteger(cardIdx) || cardIdx < 0) {
		return null;
	}

	const base = `rsrc_${sectionIdx}_${cardIdx}`;
	const map = getSafeTable();
	const get = suffix => safeGet(map, `${base}_${suffix}`);

	const card = document.createElement("a");
	card.href = get("url") || "#";
	card.target = "_blank";
	card.rel = "noopener noreferrer";
	card.className = "res-card";

	const head = document.createElement("div");
	head.className = "res-card-head";

	const iconSpan = document.createElement("span");
	iconSpan.className = "res-icon";
	iconSpan.textContent = get("emote");
	head.appendChild(iconSpan);

	const options = {
		dateStyle: "full",
		timeStyle: "long",
	};

	if (isCardNew(map, base)) {
		const dateSec = getCardDateSec(map, base);
		if (dateSec !== null) {
			const badge = document.createElement("span");
			badge.className = "badge-new";
			badge.setAttribute("data-i18n", "rsrc_date");
			badge.textContent = "new";
			badge.title = new Date(dateSec * 1000).toLocaleString(undefined, options);
			head.appendChild(badge);
		}
	}

	card.appendChild(head);

	const title = get("title");
	if (title) {
		const titleEl = document.createElement("div");
		titleEl.className = "res-title";
		titleEl.textContent = title;
		card.appendChild(titleEl);
	}

	const subtitle = get("subtitle");
	if (subtitle) {
		const subEl = document.createElement("div");
		subEl.className = "res-desc";
		subEl.style.opacity = "0.75";
		subEl.textContent = subtitle;
		card.appendChild(subEl);
	}

	const desc = get("desc");
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
		const card = buildResCard(sectionIdx, cardIdx);
		if (card) {
			grid.appendChild(card);
		}
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
	details.dataset.qaId = base;

	// preserve open state across language rebuilds
	const prev = document.querySelector(`[data-qa-id="${base}"]`);
	if (prev?.open) {
		details.open = true;
	}

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

		if (window.isHtmlString?.(a)) {
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

// Status code page

function populatePageStatusCode() {
	const main = document.querySelector("main.content");
	if (!main) {
		return;
	}

	const wrapper = main.querySelector(".status-page");
	if (!wrapper) {
		return;
	}

	const codeEl = wrapper.querySelector(".status-code");
	if (codeEl) {
		codeEl.textContent = String(resolveStatusCode());
	}

	const iconSpan = wrapper.querySelector(".status-icon .res-icon");
	if (iconSpan) {
		const shortcode = translate("sc_image");
		if (shortcode) {
			iconSpan.dataset.iconShortcode = shortcode;
		}
	}

	const descBlock = wrapper.querySelector(".status-desc");
	if (descBlock) {
		const table = getTranslationTable();
		const descKeys = Object.keys(table)
			.filter(k => /^sc_desc_\d+$/.test(k))
			.sort((a, b) => {
				const n = s => parseInt(s.replace("sc_desc_", ""), 10);
				return n(a) - n(b);
			});

		descBlock.replaceChildren(
			...descKeys.map(key => {
				const span = document.createElement("span");
				span.className = "status-desc-entry";
				span.setAttribute("data-i18n", key);
				const v = translate(key);
				if (v) {
					span.textContent = v;
				}
				return span;
			})
		);
	}

	finalize(main);
	setDocumentTitle();
}

// Bootstrap

function getBuilder(scope) {
	if (scope === "resources") {
		return populatePageResources;
	}

	if (scope === "about") {
		return populatePageAbout;
	}

	return populatePageStatusCode;
}

function populatePage() {
	const scope =
		document.documentElement.getAttribute("data-i18n-scope") ??
		(typeof currentScope !== "undefined" ? currentScope : "index");

	const builder = getBuilder(scope);
	if (builder) {
		builder();
	}
}

window.onTranslationsReady = function() {
	// rebuild lookup after lang switch so stale entries do not leak
	resetSafeTable();

	populateHeroTaglines();
	populatePage();
};