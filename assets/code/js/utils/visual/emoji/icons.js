// SVG id uniquification - prevents id collisions when multiple SVGs are inlined
/* global isFlagEmoji, renderEmojiImage */
/* exported processIconSpans, processResIcons, uniquifyAllSvgIds */

function uniquifySvgIds(svgEl) {
	if (!svgEl) {
		return;
	}

	const idEls = svgEl.querySelectorAll("[id]");
	if (idEls.length === 0) {
		return;
	}

	const map = new Map();
	const suffix = "-" + Math.random().toString(36).slice(2, 8);

	idEls.forEach(el => {
		const oldId = el.id;
		const newId = oldId + suffix;
		map.set(oldId, newId);
		el.id = newId;
	});

	const urlRef = /url\(\s*#([^)\s]+)\s*\)/g;
	const rewriteValue = val => {
		if (typeof val !== "string" || !val.includes("url(")) {
			return val;
		}

		return val.replace(urlRef, (m, id) => {
			const r = map.get(id);
			return r ? `url(#${r})` : m;
		});
	};

	[svgEl, ...svgEl.querySelectorAll("*")].forEach(el => {
		for (const attr of Array.from(el.attributes)) {
			if (attr.value?.includes("url(")) {
				const next = rewriteValue(attr.value);

				if (next !== attr.value) {
					el.setAttribute(attr.name, next);
				}
			}
		}
	});
}

function uniquifyAllSvgIds(root = document) {
	root.querySelectorAll("svg").forEach(svg => {
		if (svg.dataset.idsUniquified === "1") {
			return;
		}

		uniquifySvgIds(svg);
		svg.dataset.idsUniquified = "1";
	});
}

// Iconify fetching

const _iconSvgCache = new Map();

async function fetchIconSvg(iconId) {
	if (_iconSvgCache.has(iconId)) {
		return _iconSvgCache.get(iconId);
	}

	const [prefix, name] = iconId.split(":");
	const res = await fetch(`https://api.iconify.design/${prefix}/${name}.svg`);
	const text = await res.text();
	_iconSvgCache.set(iconId, text);

	return text;
}

function parseSvgFragment(svgText) {
	const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
	const root = doc.documentElement;

	if (!root || root.nodeName.toLowerCase() !== "svg" || root.querySelector("parsererror")) {
		return null;
	}

	return document.importNode(root, true);
}

// crypto-backed when available
function randomIndex(max) {
	if (max <= 0) {
		return 0;
	}

	const cryptoApi = window.crypto;
	if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
		const buf = new Uint32Array(1);
		cryptoApi.getRandomValues(buf);
		return buf[0] % max;
	}

	// not expected to be reached in supported browsers
	return 0;
}

// dataset helpers (no dynamic property indexing)

function readDataset(span, key) {
	switch (key) {
		case "currentShortcode": return span.dataset.currentShortcode;
		case "stateHeader":         return span.dataset.stateHeader;
		case "pendingShortcode": return span.dataset.pendingShortcode;
		default:                 return undefined;
	}
}

function writeDataset(span, key, value) {
	switch (key) {
		case "currentShortcode": span.dataset.currentShortcode = value; break;
		case "stateHeader":         span.dataset.stateHeader = value;         break;
		case "pendingShortcode": span.dataset.pendingShortcode = value; break;
		default: break;
	}
}

function normalizeCacheKey(key) {
	switch (key) {
		case "stateHeader":
		case "pendingShortcode":
			return key;
		default:
			return "currentShortcode";
	}
}

// Swap a shortcode into a span and re-run processIconSpans, guarding against
// in-flight renders. Used by theme, locale, and header toggle buttons.
function renderShortcode(span, shortcode, opts = {}) {
	const cacheKey = normalizeCacheKey(opts.cacheKey);

	if (readDataset(span, cacheKey) === shortcode && span.querySelector("svg, img")) {
		opts.onDone?.();
		return;
	}

	span.replaceChildren();
	span.textContent = shortcode;
	writeDataset(span, cacheKey, shortcode);
	span.classList.add("is-loading");

	const processIconSpansFn = window.processIconSpans;
	if (typeof processIconSpansFn !== "function") {
		span.classList.remove("is-loading");
		opts.onDone?.();
		return;
	}

	processIconSpansFn(span.closest("button, [data-icon-root]") ?? span)
		.then(() => {
			if (span.querySelector("svg, img")) {
				writeDataset(span, cacheKey, shortcode);
			}
			opts.onDone?.();
		})
		.finally(() => span.classList.remove("is-loading"));
}

window.renderShortcode = renderShortcode;

// Process icon shortcodes of the form "iconify:id|(fallback, emojis)".

function parseIconShortcode(raw) {
	if (!raw) {
		return null;
	}

	if (!raw.includes(":") && isFlagEmoji(raw)) {
		return { kind: "flag", emoji: raw };
	}

	const pipeIdx = raw.indexOf("|");
	const iconId = (pipeIdx === -1 ? raw : raw.slice(0, pipeIdx)).trim();
	const fallbackGroup = pipeIdx === -1 ? "" : raw.slice(pipeIdx + 1);

	if (!/^[a-z0-9-]+:[a-z0-9-]+$/i.test(iconId)) {
		return null;
	}

	return { kind: "iconify", iconId, fallbackGroup };
}

function pickFallbackEmoji(fallbackGroup) {
	if (!fallbackGroup) {
		return null;
	}

	const emojis = fallbackGroup
		.replace(/[()]/g, "")
		.split(",")
		.map(e => e.trim())
		.filter(Boolean);

	return emojis.length > 0 ? emojis.at(randomIndex(emojis.length)) : null;
}

async function tryFetchIcon(span, iconId, token) {
	try {
		const svgText = await fetchIconSvg(iconId);
		if (span._iconToken !== token) {
			return false;
		}

		const node = parseSvgFragment(svgText);
		if (!node) {
			return false;
		}

		span.replaceChildren(node);
		return true;
	} catch (err) {
		if (span._iconToken !== token) {
			return false;
		}

		console.error(err);
		return false;
	}
}

function processIconSpans(root = document) {
	return (async () => {
		const iconSpans = root.querySelectorAll(
			".header-link-icon, .res-icon, .social-icon, .theme-icon, .lang-icon, .toggle-icon"
		);

		for (const span of iconSpans) {
			try {
				if (span.querySelector("img, svg")) {
					continue;
				}

				const raw = (span.dataset.iconShortcode || span.textContent).trim();
				const parsed = parseIconShortcode(raw);
				if (!parsed) {
					continue;
				}

				if (parsed.kind === "flag") {
					renderEmojiImage(span, parsed.emoji);
					continue;
				}

				const myToken = (span._iconToken = (span._iconToken || 0) + 1);
				let success = false;

				if (parsed.iconId) {
					success = await tryFetchIcon(span, parsed.iconId, myToken);
				}

				if (span._iconToken !== myToken) {
					return;
				}

				if (!success) {
					const emoji = pickFallbackEmoji(parsed.fallbackGroup);
					if (emoji) {
						renderEmojiImage(span, emoji);
						success = true;
					}
				}

				if (!success) {
					span.textContent = raw;
				}

				span.classList.remove("is-loading");
			} catch (err) {
				console.error("processIconSpans:", err);
			}
		}
	})().catch((err) => {
		console.error("processIconSpans:", err);
	});
}

function processResIcons(root = document) {
	root.querySelectorAll(".res-icon").forEach(span => {
		if (span.querySelector("img")) {
			return;
		}

		const emoji = span.textContent.trim();
		if (!emoji) {
			return;
		}

		renderEmojiImage(span, emoji, "res-icon-img");
	});
}