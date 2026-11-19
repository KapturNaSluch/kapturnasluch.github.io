/* global detectScope */

Object.defineProperty(String.prototype, "capitalize", {
	value: function () {
		return this
			.charAt(0)
			.toUpperCase() + this.slice(1);
	},
	enumerable: false,
});

Object.defineProperty(String.prototype, "title", {
	value: function () {
		return this
			.toLowerCase()
			.split(" ")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	},
	enumerable: false,
});

// --- //

let _baseTitle = null;

function resolveSlug() {
	const detected = typeof detectScope === "function" ? detectScope() : null;
	if (detected) {
		return detected;
	}

	const path = window.location.pathname.replace(/\/+$/, "");
	const segments = path.split("/").filter(Boolean);
	let last = segments[segments.length - 1] || "";

	if (/^index\.html?$/i.test(last)) {
		last = segments[segments.length - 2] || "";
	}

	return last || "home";
}

function resolveStatusCode() {
	const meta = document.querySelector('meta[name="status-code"]');
	if (meta?.content && /^\d{3}$/.test(meta.content.trim())) {
		return meta.content.trim();
	}

	const attr = document.documentElement.getAttribute("data-status-code");
	if (attr && /^\d{3}$/.test(attr.trim())) {
		return attr.trim();
	}

	if (typeof window.__STATUS_CODE__ !== "undefined") {
		return String(window.__STATUS_CODE__);
	}

	const m = location.pathname.match(/(?:^|\/)([1-5]\d{2})(?:\/|\.|$)/)
		|| location.search.match(/[?&]status=([1-5]\d{2})\b/);
	if (m) {
		return m[1];
	}

	return "404";
}

function titleKeyFor(slug) {
	return (slug === "home" || slug === "index")
		? "index_page_title"
		: `${slug}_page_title`;
}

function setDocumentTitle() {
	if (_baseTitle === null) {
		const titleEl = document.getElementsByTagName("title")[0];
		_baseTitle = titleEl?.textContent || "Webpage";
	}

	const base = _baseTitle;

	const slug = resolveSlug();
	const titleKey = titleKeyFor(slug);

	const translateFn = window.translate;
	const raw = typeof translateFn === "function"
		? translateFn(titleKey, null, "en")
		: "";

	const label = raw ? raw.title() : "";

	const isHome = slug === "home" || slug === "index" || slug === "";

	document.title = isHome || !label
		? base
		: `${base} │ ${label}`;
}

window.setDocumentTitle = setDocumentTitle;