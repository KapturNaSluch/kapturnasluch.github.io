// Background video playlist player

const BackgroundVideo = (() => {
	// Config & state
	const STATE = {
		container: null,
		videos: [],
		active: null,
		inactive: null,
		playlist: [],
		speed: 1,
		currentIndex: 0,
		switching: false,
		nextReady: null,
	};

	// Helpers

	function entryAt(index) {
		return STATE.playlist.at(index);
	}

	function getURL(index) {
		const entry = entryAt(index);
		if (typeof entry !== "string" || entry.length === 0) {
			throw new Error(`Invalid playlist entry at index ${index}`);
		}

		return new URL(entry, document.baseURI).href;
	}

	function readPlaylist(videoEl) {
		try {
			return JSON.parse(videoEl.dataset.playlist || "[]");
		} catch (error) {
			console.error("[Video] Invalid playlist:", error);
			return [];
		}
	}

	// Video element creation

	function createBuffers(container, speed) {
		return [document.createElement("video"), document.createElement("video")].map(video => {
			video.muted = true;
			video.playsInline = true;
			video.autoplay = false;
			video.preload = "auto";
			video.defaultPlaybackRate = speed;
			video.playbackRate = speed;

			container.appendChild(video);
			return video;
		});
	}

	// Load & wait for canplay

	function prepare(video, index) {
		return new Promise((resolve, reject) => {
			let settled = false;

			const cleanup = () => {
				video.removeEventListener("canplay", onReady);
				video.removeEventListener("error", onError);
			};

			const onReady = () => {
				if (settled) {
					return;
				}
				settled = true;

				cleanup();
				resolve();
			};

			const onError = () => {
				if (settled) {
					return;
				}

				settled = true;
				cleanup();

				const entry = entryAt(index);
				reject(new Error(`Failed to load: ${typeof entry === "string" ? entry : "unknown"}`));
			};

			video.pause();
			video.addEventListener("canplay", onReady);
			video.addEventListener("error", onError);

			try {
				video.src = getURL(index);
			} catch (err) {
				settled = true;
				cleanup();
				reject(err);
				return;
			}

			video.load();

			if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
				onReady();
			}
		});
	}

	// Playback

	async function startFirst() {
		try {
			await prepare(STATE.active, STATE.currentIndex);
			STATE.active.classList.add("is-active");

			await STATE.active.play();
		} catch (error) {
			if (error.name === "NotAllowedError") {
				console.warn("[Video] Autoplay blocked by browser.");
			} else {
				console.error("[Video] Initial playback failed:", error);
				throw error;
			}
		}
	}

	async function preloadNext() {
		const nextIndex = (STATE.currentIndex + 1) % STATE.playlist.length;

		STATE.nextReady = prepare(STATE.inactive, nextIndex).catch(error => {
			console.error("[Video] Preloading failed:", error);
			return false;
		});

		return STATE.nextReady;
	}

	async function switchVideo() {
		if (STATE.switching) {
			return;
		}

		STATE.switching = true;

		const outgoing = STATE.active;
		const incoming = STATE.inactive;

		try {
			const ready = await STATE.nextReady;
			if (ready === false) {
				console.error("[Video] Next video isn't available.");
				return;
			}

			incoming.playbackRate = STATE.speed;
			await incoming.play();

			// CSS-driven crossfade: class toggle only
			incoming.classList.add("is-active");
			outgoing.classList.remove("is-active");

			await new Promise(resolve => setTimeout(resolve, 300));

			outgoing.pause();

			STATE.currentIndex = (STATE.currentIndex + 1) % STATE.playlist.length;
			STATE.active = incoming;
			STATE.inactive = outgoing;

			await preloadNext();
		} catch (error) {
			console.error("[Video] Switching failed:", error);
		} finally {
			STATE.switching = false;
		}
	}

	// Init

	async function init() {
		const container = document.querySelector(".background-media");
		if (!container) {
			return;
		}

		const original = container.querySelector("video");
		if (!original) {
			console.error("[Video] Original video element not found!");
			return;
		}

		const playlist = readPlaylist(original);
		const speed = original.playbackRate || 1;

		original.remove();

		if (!Array.isArray(playlist) || playlist.length === 0) {
			console.error("[Video] Playlist is empty!");
			return;
		}

		if (getComputedStyle(container).position === "static") {
			container.style.position = "relative";
		}

		STATE.container = container;
		STATE.playlist = playlist;
		STATE.speed = speed;

		const [a, b] = createBuffers(container, speed);
		STATE.videos = [a, b];
		STATE.active = a;
		STATE.inactive = b;

		try {
			await startFirst();
		} catch {
			return;
		}

		await preloadNext();

		STATE.videos.forEach(video => video.addEventListener("ended", switchVideo));
	}

	// return { init };
})();

// expose for linters
window.BackgroundVideo = BackgroundVideo;

document.addEventListener("DOMContentLoaded", () => BackgroundVideo.init());