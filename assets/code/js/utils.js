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

function setDocumentTitle() {
	if (_baseTitle === null) {
		const titleEl = document.getElementsByTagName("title")[0];
		_baseTitle = titleEl && titleEl.textContent ? titleEl.textContent : "Webpage";
	}
	const base = _baseTitle;

	let slug = document.documentElement.getAttribute("data-i18n-scope");

	if (!slug) {
		const path = window.location.pathname.replace(/\/+$/, "");
		const segments = path.split("/").filter(Boolean);
		let last = segments[segments.length - 1] || "";

		if (/^index\.html?$/i.test(last)) {
			last = segments[segments.length - 2] || "";
		}

		slug = last || "home";
	}

	const titleKey = (slug === "home" || slug === "index")
		? "index_page_title"
		: `${slug}_page_title`;

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