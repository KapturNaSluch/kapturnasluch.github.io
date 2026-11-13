document.addEventListener("DOMContentLoaded", async () => {
	const container = document.querySelector(".background-media");

	if (!container) {
		console.error("[Video] Container not found!");
		return;
	}

	const originalVideo = container.querySelector("video");

	if (!originalVideo) {
		console.error("[Video] Original video element not found!");
		return;
	}

	let playlist = [];
	const speed = originalVideo.playbackRate || 1;

	try {
		playlist = JSON.parse(originalVideo.dataset.playlist || "[]");
	} catch (error) {
		console.error("[Video] Invalid playlist:", error);
		return;
	}

	originalVideo.remove();

	if (!Array.isArray(playlist) || playlist.length === 0) {
		console.error("[Video] Playlist is empty!");
		return;
	}

	// container cfg
	if (getComputedStyle(container).position === "static") {
		container.style.position = "relative";
	}

	container.style.overflow = "hidden";

	// dbl buffers init
	const videos = [document.createElement("video"), document.createElement("video")];

	videos.forEach(video => {
		video.muted = true;
		video.playsInline = true;
		video.autoplay = false;
		video.preload = "auto";
		video.defaultPlaybackRate = speed;
		video.playbackRate = speed;

		Object.assign(video.style, {
			position: "absolute",
			zIndex: "1",
			transition: "opacity 0.125s ease-in-out"
		});

		container.appendChild(video);
	});

	let active = videos[0];
	let inactive = videos[1];

	let currentIndex = 0;
	let switching = false;
	let nextReady = null;

	// Typed accessor - entry is always validated as a string before use,
	// and we don't index with the raw value (uses Array.prototype.at).
	const entryAt = (index) => playlist.at(index);

	const getURL = index => {
		const entry = entryAt(index);

		if (typeof entry !== "string" || entry.length === 0) {
			throw new Error(`Invalid playlist entry at index ${index}`);
		}

		return new URL(entry, document.baseURI).href;
	};

	// load vid & wait until it can play
	function prepare(video, index) {
		return new Promise((resolve, reject) => {
			let settled = false;

			const cleanup = () => {
				video.removeEventListener("canplay", onReady);
				video.removeEventListener("error", onError);
			};

			const onReady = () => {
				if (settled) return;
				settled = true;
				cleanup();
				resolve();
			};

			const onError = () => {
				if (settled) return;
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

			// handle cached/already-loaded sources
			if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
				onReady();
			}
		});
	}

	// start 1st vid
	try {
		await prepare(active, currentIndex);

		active.style.zIndex = "2";
		active.style.opacity = "1";

		await active.play();

	} catch (error) {
		console.error("[Video] Initial playback failed:", error);
		return;
	}

	// preload next vid
	function preloadNext() {
		const nextIndex = (currentIndex + 1) % playlist.length;

		nextReady = prepare(inactive, nextIndex).catch(error => {
			console.error("[Video] Preloading failed:", error);
			return false;
		});

		return nextReady;
	}

	await preloadNext();

	// switch vids
	async function switchVideo() {
		if (switching) {
			return;
		}

		switching = true;

		const outgoing = active;
		const incoming = inactive;

		try {
			// await incoming video
			const ready = await nextReady;

			if (ready === false) {
				console.error("[Video] Next video isn't available.");
				return;
			}

			// start playback BEFORE changing visibility
			incoming.playbackRate = speed;
			await incoming.play();

			// pseudo-fade in the new video
			incoming.style.zIndex = "2";
			incoming.style.opacity = "1";

			outgoing.style.zIndex = "1";
			outgoing.style.opacity = "0";

			// allow transition to finish
			await new Promise(resolve => setTimeout(resolve, 300));

			// release old video
			outgoing.pause();

			currentIndex = (currentIndex + 1) % playlist.length;

			// swap buffers
			active = incoming;
			inactive = outgoing;

			// prepare next playlist entry
			await preloadNext();

		} catch (error) {
			console.error("[Video] Switching failed:", error);
		} finally {
			switching = false;
		}
	}

	// both vids need this listener
	videos.forEach(video => {
		video.addEventListener("ended", switchVideo);
	});
});