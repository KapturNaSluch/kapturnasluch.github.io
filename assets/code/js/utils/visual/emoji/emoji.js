/* exported emojiToTwemojiUrl, renderEmojiImage, isFlagEmoji, resolveShortcodes */

const TWEMOJI_BASE = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/";

function emojiToTwemojiUrl(emoji) {
	const codepoints = Array.from(emoji)
		.map(ch => ch.codePointAt(0).toString(16))
		.filter(cp => cp !== "fe0f")
		.join("-");

	return `${TWEMOJI_BASE}${codepoints}.svg`;
}

// Renders a Twemoji <img> into span, falling back to raw text on error.
// className defaults to "lang-icon-img" for icon spans; pass "res-icon-img" for resource icons.
function renderEmojiImage(span, emoji, className = "lang-icon-img") {
	const img = document.createElement("img");
	img.src = emojiToTwemojiUrl(emoji);
	img.alt = emoji;
	img.className = className;
	img.loading = "lazy";
	img.onerror = () => { span.textContent = emoji; };
	span.replaceChildren(img);
}

const TWEMOJI_SHORTCODES = {
	":flag_pl:": "🇵🇱",
	":flag_us:": "🇺🇸",
	":flag_gb:": "🇬🇧",
};

function resolveShortcodes(text) {
	if (!text) {
		return text;
	}

	return text.replace(/:[a-z0-9_+-]+:/gi, (m) => TWEMOJI_SHORTCODES[m.toLowerCase()] || m);
}

function isFlagEmoji(str) {
	return /\p{Regional_Indicator}{2}/u.test(String(str).trim());
}