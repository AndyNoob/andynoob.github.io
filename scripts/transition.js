$(function () {
	addListeners();
});

window.addEventListener("beforeunload", (e) => {
	localStorage.setItem("last-site", location.href);
	$("body").toggleClass("slide-left");
});

function addListeners() {
	$("a").each((index, element) => {
		element.addEventListener("click", onHyperlink);
	});
}

function onHyperlink(e) {
	e.preventDefault();

	let link = e.target.closest("a").href;

	setTimeout(() => {
		window.location.href = link;
	}, 250);
}
