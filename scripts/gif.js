$(function () {
	load();
});

function load() {
	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	let load = 0;

	canvas.style.position = "absolute";

	for (let image of document.querySelectorAll("[data-image]")) {
		let url = absolute(location.href, image.dataset.image);
		let width = image.style.width;
		let height = image.style.height;

		let newImage =
			width && height
				? new Image(width, height) : new Image();

		newImage.src = url;
		newImage.onload = (e) => {
			canvas.width = newImage.width;
			canvas.height = newImage.height;
			canvas.getContext("2d").drawImage(newImage, 0, 0);

			let staticDataUrl = canvas.toDataURL();

			image.dataset.staticImage = staticDataUrl;
			image.src = staticDataUrl;

			$(image)
				.on("mouseenter", (e) => {
					image.src = url;
				})
				.on("mouseleave", (e) => {
					image.src = staticDataUrl;
				});

			load--;

			if (!load) {
				console.log("removed canvas");
				canvas.remove();
			}
		};

		load++;
	}

	if (!load) {
		console.log("removed canvas");
		canvas.remove();
	}
}

function absolute(base, relative) {
	// stackoverfloww
	let stack = base.split("/");
	let parts = relative.split("/");

	stack.pop(); // remove current file name (or empty string)

	// (omit if "base" is the current folder without trailing slash)
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] == ".") continue;
		if (parts[i] == "..") stack.pop();
		else stack.push(parts[i]);
	}
	return stack.join("/");
}
