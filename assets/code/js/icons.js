// SVG id uniquification - prevents id collisions when multiple SVGs are inlined

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

// Iconify fetching - cache makes repeated renders instant, no flash

const _iconSvgCache = new Map();

async function fetchIconSvg(iconId) {
	if (_iconSvgCache.has(iconId)) {
		return _iconSvgCache.get(iconId);
	}

	const [prefix, name] = iconId.split(":");
	if (!prefix || !name) {
		throw new Error(`Invalid icon ID: ${iconId}`);
	}

	const res = await fetch(`https://api.iconify.design/${prefix}/${name}.svg`);
	if (!res.ok) {
		throw new Error(`Failed to load iconify ID: ${iconId}`);
	}

	const text = await res.text();
	_iconSvgCache.set(iconId, text);

	return text;
}

// Parse an Iconify SVG string into a live DOM node without using innerHTML
function parseSvgFragment(svgText) {
	const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
	const root = doc.documentElement;

	if (!root || root.nodeName.toLowerCase() !== "svg" || root.querySelector("parsererror")) {
		return null;
	}

	return document.importNode(root, true);
}

// Uniformly-distributed index, crypto-backed when available
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

	// Defensive fallback - not expected to be reached in supported browsers
	return 0;
}

// Process icon shortcodes of the form "iconify:id|(fallback, emojis)".
let _iconRenderSeq = 0;

function processIconSpans(root = document) {
	return (async () => {
		const iconSpans = root.querySelectorAll(
			".nav-link-icon, .res-icon, .social-icon, .theme-icon, .lang-icon, .toggle-icon"
		);

		for (const span of iconSpans) {
			try {
				if (span.querySelector("img, svg")) {
					continue;
				}

				const raw = (span.dataset.iconShortcode || span.textContent).trim();
				if (!raw) {
					continue;
				}

				const pipeIdx = raw.indexOf("|");
				const iconId = (pipeIdx === -1 ? raw : raw.slice(0, pipeIdx)).trim();
				const fallbackGroup = pipeIdx === -1 ? "" : raw.slice(pipeIdx + 1);

				// Validate the shortcode head with a literal regex (no `.*`, no
				// constructor-built pattern) — this is the only place the string is
				// interpreted, so it's the right place to gate it.
				if (!/^[a-z0-9-]+:[a-z0-9-]+$/i.test(iconId)) {
					continue;
				}

				const myToken = (span._iconToken = (span._iconToken || 0) + 1);

				let success = false;

				if (iconId) {
					try {
						const svgText = await fetchIconSvg(iconId);
						if (span._iconToken !== myToken) {
							return;
						}

						const node = parseSvgFragment(svgText);

						if (node) {
							span.replaceChildren(node);
							success = true;
						}
					} catch (err) {
						if (span._iconToken !== myToken) return;
						console.error(err);
					}
				}

				if (span._iconToken !== myToken) {
					return;
				}

				if (!success && fallbackGroup) {
					const emojis = fallbackGroup.replace(/[()]/g, "").split(",").map(e => e.trim()).filter(Boolean);

					if (emojis.length > 0) {
						const randomEmoji = emojis.at(randomIndex(emojis.length));
						const codepoints = Array.from(randomEmoji)
							.map(c => c.codePointAt(0).toString(16))
							.filter(cp => cp !== "fe0f")
							.join("-");

						const image = document.createElement("img");
						image.src = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codepoints}.svg`;
						image.alt = randomEmoji;
						image.style.width = "1.2em";
						image.style.height = "1.2em";
						image.style.verticalAlign = "-0.2em";
						image.loading = "lazy";
						image.onerror = () => { span.textContent = randomEmoji; };

						span.replaceChildren(image);
						success = true;
					}
				}

				if (!success) {
					span.textContent = raw;
				}
			} catch (err) {
				console.error("processIconSpans:", err);
			}
		}
	})().catch((err) => {
		console.error("processIconSpans:", err);
	});
}

// Render plain emoji in .res-icon spans as Twemoji images

function processResIcons(root = document) {
	const emojiToTwemojiUrlFn = window.emojiToTwemojiUrl;
	if (typeof emojiToTwemojiUrlFn !== "function") {
		return;
	}

	root.querySelectorAll(".res-icon").forEach(span => {
		if (span.querySelector("img")) {
			return;
		}

		const emoji = span.textContent.trim();
		if (!emoji) {
			return;
		}

		const img = document.createElement("img");
		img.src = emojiToTwemojiUrlFn(emoji);
		img.alt = emoji;
		img.className = "res-icon-img";
		img.loading = "lazy";
		img.onerror = () => { span.textContent = emoji; };

		span.replaceChildren(img);
	});
}