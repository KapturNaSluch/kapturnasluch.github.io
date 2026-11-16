// Footer social list builder
// Depends on: icons.js (processIconSpans)

const URL_DATA = "/assets/code/json/places/data.json";

// Data loading

let _placesPromise = null;

function loadPlaces(url = URL_DATA) {
	if (_placesPromise) {
		return _placesPromise;
	}

	_placesPromise = fetch(url)
		.then(r => {
			if (!r.ok) {
				throw new Error(`places fetch failed: ${r.status}`);
			}
			return r.json();
		})
		.catch(err => {
			console.warn("[footer] places load failed:", err);
			return {};
		});

	return _placesPromise;
}

// DOM building

function buildSocialItem(label, entry) {
	if (!entry || typeof entry !== "object") {
		return null;
	}

	const shortcodes = Object.keys(entry);
	if (shortcodes.length === 0) {
		return null;
	}

	const shortcode = shortcodes[0];

	const entryMap = new Map(Object.entries(entry));
	const href = entryMap.get(shortcode);

	if (typeof href !== "string" || href.length === 0) {
		return null;
	}

	const li = document.createElement("li");

	const a = document.createElement("a");
	a.href = href;
	a.target = "_blank";
	a.rel = "noopener";

	// .social-icon is picked up by processIconSpans
	const icon = document.createElement("span");
	icon.className = "social-icon";
	icon.textContent = shortcode;
	a.appendChild(icon);

	a.appendChild(document.createTextNode(label));

	li.appendChild(a);
	return li;
}

function buildSocialItems(places) {
	const items = [];

	for (const [label, entry] of Object.entries(places ?? {})) {
		const li = buildSocialItem(label, entry);
		if (li) {
			items.push(li);
		}
	}

	return items;
}

// entry point

async function populateFooterSocials(root = document) {
	const list = root.querySelector(".footer .social-list, .social-list");
	if (!list) {
		return;
	}

	if (list.dataset.populated === "1") {
		return;
	}

	const places = await loadPlaces();
	list.replaceChildren(...buildSocialItems(places));
	list.dataset.populated = "1";

	window.processIconSpans?.(list);
}

window.populateFooterSocials = populateFooterSocials;
window.loadPlaces            = loadPlaces;
window.buildSocialItem       = buildSocialItem;
window.buildSocialItems      = buildSocialItems;

populateFooterSocials();