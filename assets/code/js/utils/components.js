/* global getHtmlPolicy */
function executeScripts(root) {
	root.querySelectorAll("script").forEach(old => {
		if (old.dataset.executed === "1") {
			return;
		}

		old.dataset.executed = "1";

		const script = document.createElement("script");
		for (const attr of old.attributes) {
			script.setAttribute(attr.name, attr.value);
		}

		script.textContent = old.textContent;
		old.replaceWith(script);
	});
}

// setHTMLUnsafe
function parseComponentHtmlUnsafe(container, html, rootPath) {
	const temp = document.createElement(container.localName || "div");

	temp.setHTMLUnsafe(html); // eslint-disable-next-line no-unsanitized/method
	replaceInFragment(temp, "{root}", rootPath.trimEnd("/"));

	return temp.childNodes;
}

// Trusted-Types ctx-frag
function parseComponentHtmlTrusted(container, html, rootPath) {
	const range = document.createRange();

	range.selectNodeContents(container);

	const trusted = getHtmlPolicy().createHTML(html); // eslint-disable-next-line no-unsanitized/method
	const frag = range.createContextualFragment(trusted); // eslint-disable-next-line no-unsanitized/method

	replaceInFragment(frag, "{root}", rootPath);

	return frag;
}

function insertComponentHtml(container, nodes) {
	container.replaceChildren(...nodes);
	executeScripts(container);
}

function parseComponentHtml(container, html, rootPath) {
	if (typeof container.setHTMLUnsafe === "function") {
		return parseComponentHtmlUnsafe(container, html, rootPath); // eslint-disable-next-line no-unsanitized/method
	}

	
	return parseComponentHtmlTrusted(container, html, rootPath); // eslint-disable-next-line no-unsanitized/method
}

async function loadComponent(selector, file, rootPath, callback) {
	let container = document.querySelector(selector);
	rootPath = rootPath.replace(/\/+$/, "") || ".";

	if (!container && selector.startsWith("#")) {
		container = document.querySelector("." + selector.slice(1));
	}

	if (!container) {
		console.warn(`loadComponent: no element matches "${selector}" on ${location.pathname}`);
		return;
	}

	try {
		const response = await fetch(file);

		if (!response.ok) {
			throw new Error(`Fetch failed: ${file} (${response.status})`);
		}

		const html = await response.text();

		const nodes = parseComponentHtml(container, html, rootPath); // eslint-disable-next-line no-unsanitized/method

		insertComponentHtml(container, nodes);

		window.processIconSpans?.(container);
		window.processResIcons?.(container);
		window.uniquifyAllSvgIds?.(container);

		const applyTranslationsFn = window.applyTranslations;
		if (typeof applyTranslationsFn === "function") {
			applyTranslationsFn();
		}

		if (callback) {
			callback();
		}

		requestAnimationFrame(rescrollToHash);
	} catch (error) {
		console.warn(
			"CORS/Fetch restriction hit for local file loading. Consider running a local server (e.g. Live Server).",
			error
		);
	}
}

// Exposed for use by other scripts (and to silence no-unused-vars)
window.loadComponent = loadComponent;

function replaceInFragment(node, search, replacement) {
	if (!search) {
		return;
	}

	if (node.nodeType === Node.ELEMENT_NODE) {
		for (const attr of Array.from(node.attributes)) {
			if (attr.value.includes(search)) {
				node.setAttribute(attr.name, attr.value.split(search).join(replacement));
			}
		}
	}

	const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
	let text = walker.nextNode();

	while (text) {
		if (text.nodeValue && text.nodeValue.includes(search)) {
			text.nodeValue = text.nodeValue.split(search).join(replacement);
		}

		text = walker.nextNode();
	}

	node.querySelectorAll("*").forEach(el => {
		for (const attr of Array.from(el.attributes)) {
			if (attr.value.includes(search)) {
				el.setAttribute(attr.name, attr.value.split(search).join(replacement));
			}
		}
	});
}

// Mobile nav - morphing toggle icon, outside-click, resize reset

const NAV_ICONS = {
	closed:  "line-md:menu|(≡)",
	opening: "line-md:menu-to-close-transition|(✕)",
	closing: "line-md:close-to-menu-transition|(≡)"
};

function navIconFor(state) {
	if (state === "closed") {
		return NAV_ICONS.closed;
	}

	if (state === "opening") {
		return NAV_ICONS.opening;
	}

	if (state === "closing") {
		return NAV_ICONS.closing;
	}

	return null;
}

function updateMobileNavIcon(state) {
	const btn = document.querySelector(".nav-toggle-btn");
	if (!btn) {
		return;
	}

	const span = btn.querySelector(".toggle-icon") || btn;
	const shortcode = navIconFor(state);
	if (!shortcode) {
		return;
	}

	if (span.dataset.navState === state) {
		return;
	}

	span.dataset.navState = state;
	span.dataset.pendingShortcode = shortcode;
	span.classList.add("is-loading");

	const renderShortcode = span.dataset.pendingShortcode;
	const holder = document.createElement("span");
	holder.className = span.className;
	holder.textContent = renderShortcode;

	window.processIconSpans?.({ querySelectorAll: () => [holder] })
		.then(() => {
			if (span.dataset.pendingShortcode !== renderShortcode) {
				return;
			}

			span.replaceChildren(...holder.childNodes);
		})
		.finally(() => span.classList.remove("is-loading"));
}

window.updateMobileNavIcon = updateMobileNavIcon;

window.toggleMobileNav = function (event) {
	if (event && typeof event.stopPropagation === "function") {
		event.stopPropagation();
	}

	const controls = document.getElementsByClassName("nav-controls")[0];
	if (!controls) {
		return;
	}

	const willOpen = !controls.classList.contains("active");
	controls.classList.toggle("active");

	updateMobileNavIcon(willOpen ? "opening" : "closing");
};

function closeMobileNav() {
	const controls = document.getElementsByClassName("nav-controls")[0];
	if (!controls || !controls.classList.contains("active")) {
		return;
	}

	controls.classList.remove("active");
	updateMobileNavIcon("closing");
}

// Close the mobile menu
document.addEventListener("click", (e) => {
	const nav = document.querySelector("nav");
	const controls = document.querySelector(".nav-controls");
	if (!nav || !controls) {
		return;
	}

	if (!controls.classList.contains("active")) {
		return;
	}

	// composedPath() is a snapshot taken at dispatch time, so it still
	// contains the nav even if the icon swap detached e.target.
	const path = typeof e.composedPath === "function" ? e.composedPath() : [];
	if (path.includes(nav) || nav.contains(e.target)) {
		return;
	}

	closeMobileNav();
});

// Reset state when the viewport crosses the desktop breakpoint
let _navResizeRaf = null;
window.addEventListener("resize", () => {
	if (_navResizeRaf) {
		return;
	}

	_navResizeRaf = requestAnimationFrame(() => {
		_navResizeRaf = null;
	
		if (window.innerWidth > 750) {
			const controls = document.querySelector(".nav-controls");
			if (controls) {
				controls.classList.remove("active");
			}

		updateMobileNavIcon("closed");
		}
	});
});

// Hash scrolling

function rescrollToHash({ smooth = false } = {}) {
	if (!location.hash) {
		return;
	}

	const id = decodeURIComponent(location.hash.slice(1));
	const el = document.getElementById(id);
	if (!el) {
		return;
	}

	const navH = document.querySelector("nav")?.getBoundingClientRect().height || 0;

	window.scrollTo({
		top: el.getBoundingClientRect().top + window.scrollY - navH,
		behavior: smooth ? "smooth" : "instant",
	});
}

window.addEventListener("hashchange", () => requestAnimationFrame(() => rescrollToHash({ smooth: true })));

// Bootstrap

document.addEventListener("DOMContentLoaded", () => {
	window.processIconSpans?.();
	window.processResIcons?.();
	window.uniquifyAllSvgIds?.();
	window.applyTheme?.(window.currentTheme ?? "dark");

	requestAnimationFrame(rescrollToHash);

	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
		if (!localStorage.getItem("theme")) {
			window.applyTheme?.(e.matches ? "dark" : "light");
		}
	});
});