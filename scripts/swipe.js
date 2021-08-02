document.addEventListener("touchstart", handleTouchStart, true);
document.addEventListener("touchmove", handleTouchMove, true);

let callback = null;

var xDown = null;
var yDown = null;

function getTouches(e) {
	return (
		e.touches || // browser API
		e.originalEvent.touches
	);
}

function handleTouchStart(e) {
	let firstTouch = getTouches(e)[0];

	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
	
	e.preventDefault();
}

function handleTouchMove(e) {
	if (!xDown || !yDown || !callback) {
		return;
	}

	let xUp = e.touches[0].clientX;
	let yUp = e.touches[0].clientY;

	let xDiff = xDown - xUp;
	let yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		// most significant 
		if (xDiff > 0) {
			// left swipe 
			callback("ArrowLeft");
		} else {
			// right swipe
			callback("ArrowRight");
		}
	} else {
		if (yDiff > 0) {
			// up swipe
			callback("ArrowUp");
		} else {
			// down swipe
			callback("ArrowDown");
		}
	}

	// reset values 
	xDown = null;
	yDown = null;

	e.preventDefault();
}
