let sections = $(".container section");

$(function () {
	addNavigation();
	checkChrome();

	observerCheck();

	window.addEventListener(
		"scroll",
		(e) => {
			observerCheck();
		},
		true
	);
});

function observerCheck() {
	sections.each((index, element) => {
		let observer = new IntersectionObserver(observerCallback, {
			root: $(".container")[0],
			rootMargin: "5px",
			threshold: 1.0,
		});
		observer.observe(element);
	});
}

function observerCallback(entries, observer) {
	for (let entry of entries) {
		entry.target.dataset.triggered = entry.intersectionRatio > 0.3 ? "true" : "false";
	}
}

function addNavigation() {
	let navigation = document.createElement("div");
	navigation.id = "navigation";

	let count = 0;

	sections.each((index, element) => {
		if (index == 0) {
			element.scrollIntoView();
		}

		let section = document.createElement("div");

		section.addEventListener("click", (e) => {
			element.scrollIntoView({
				behavior: "smooth",
			});
		});

		navigation.appendChild(section);

		count++;
	});

	navigation.style.transform = `translate(90vw, calc(-50vh - ${0.6 * count}em))`;

	document.body.appendChild(navigation);
}

function round(number, places) {
	return Number(Math.round(number + "e" + places) + "e-" + places);
}

function checkChrome() {
	if (navigator.userAgent.match("Chrome")) {
		console.log("chrome detected, disabling scroll snapping");
		$(".container").attr("data-snap", "false");
	} else {
		console.log("non-chrome detected, enabling scroll snapping");
		$(".container").attr("data-snap", "true");
	}
}
