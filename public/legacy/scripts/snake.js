if (!isMobile()) {
	console.log("non-mobile detected");
	$("body").on("keydown", (e) => {
		press(e.key);
	});
} else {
	console.log("mobile detected");
	callback = press;
}

const canvas = $("#canvas")[0];
const context = canvas.getContext("2d");
const unit = 3; // aka speed per second
const tickSpeed = 60;

//#region Directions
const none = { x: 0, y: 0, isX: false };
// y
const north = { x: 0, y: 1, isX: false };
const south = { x: 0, y: -1, isX: false };
// x
const west = { x: -1, y: 0, isX: true };
const east = { x: 1, y: 0, isX: true };
//#endregion

//#region Snake objects
const bodies = [{ x: unit * 20, y: unit * 4, direction: east, isNew: false }];
const apple = {
	x: unit * 140,
	y: unit * 4,
};
//#endregion

let next = none;
let isPlaying = true;
let canDrawSnake = false;

let startDate = null;
let format = new Intl.DateTimeFormat("en", { minute: "numeric", second: "numeric" });

let lastTick = performance.now();
let deltaTime = 0;

let score = 0;
let isOver = false;
let startedPlaying = false;

console.log("starting...");
setInterval(() => {
	tick();
}, 1000 / tickSpeed);

function tick() {
	if (!isPlaying) {
		lastTick = performance.now();
		return;
	}

	deltaTime = (performance.now() - lastTick) / 1000;
	lastTick = performance.now();

	draw();

	if (isOver) {
		return;
	}

	move();
}

function draw() {
	let currentDate = new Date();

	currentDate.setTime(!isOver && startedPlaying ? currentDate.getTime() - startDate.getTime() : 0);

	let parts = format.formatToParts(currentDate);

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "white";
	context.fillRect(apple.x - 6, apple.y - 6, 12, 12);

	for (let body of bodies) {
		if (body.isNew) {
			continue;
		}

		context.fillStyle = "white";
		context.fillRect(body.x - 8, body.y - 8, 16, 16);
	}

	let size = canvas.width * 0.05;
	context.font = `${size}px Common Pixel`;
	context.fillStyle = "white";

	context.fillText(`Score: ${score}`, canvas.width * 0.05, canvas.height * 0.95);
	context.fillText(`Time: ${parts.map((obj) => obj.value).join("")}`, canvas.width * 0.4, canvas.height * 0.95);

	if (!isOver) {
		return;
	}

	context.font = "36px Common Pixel";
	context.fillStyle = "white";
	context.fillText("Game over, you suck", canvas.width / 4, canvas.height / 4);
}

function move() {
	let lastSnakeHead = bodies[0];
	let snakeHead = bodies.pop();

	if (!(lastSnakeHead && snakeHead)) {
		return;
	}

	if (
		(snakeHead.x < 0 || snakeHead.x > canvas.width || snakeHead.y < 0 || snakeHead.y > canvas.height) &&
		!snakeHead.isNew
	) {
		isOver = true;
		return;
	}

	snakeHead.isNew = false;

	if (next) {
		snakeHead.direction = next;
	}

	let offset = getOffset(snakeHead.direction, 0.5);
	snakeHead.x = lastSnakeHead.x + (snakeHead.direction.x * unit) / 2 - offset.x;
	snakeHead.y = lastSnakeHead.y - (snakeHead.direction.y * unit) / 2 - offset.y;

	bodies.unshift(snakeHead);

	checkCollision(snakeHead);
}

function addBody() {
	let lastBody = bodies[bodies.length - 1];

	if (!lastBody) {
		return;
	}

	let offset = getOffset(lastBody.direction, bodies.length);
	bodies.push({ x: lastBody.x - offset.x, y: lastBody.y - offset.y, isNew: true });
	console.log("added new body");
}

function press(key) {
	let push = true;
	let toPush = null;

	let snakeHead = bodies[0];

	if (!snakeHead) {
		return;
	}

	switch (key) {
		case "ArrowLeft":
			if (snakeHead.direction != east) {
				toPush = west;
			}
			break;
		case "ArrowRight":
			if (snakeHead.direction != west) {
				toPush = east;
			}
			break;
		case "ArrowUp":
			if (snakeHead.direction != south) {
				toPush = north;
			}
			break;
		case "ArrowDown":
			if (snakeHead.direction != north) {
				toPush = south;
			}
			break;
		default:
			push = false;
			break;
	}

	if (push) {
		if (!toPush) {
			return;
		}
		next = toPush;
		startedPlaying = true;

		if (!startDate) {
			startDate = new Date();
		}
	}
}

function checkCollision(snakeHead) {
	// couldn't get sat collision working so i had to choose distance
	for (let body of bodies) {
		if (body == snakeHead) {
			continue;
		}

		let dx = snakeHead.x - body.x;
		let dy = snakeHead.y - body.y;

		let distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < unit) {
			console.log("collided with body");
			isOver = true;
			break;
		}
	}

	let dx = snakeHead.x - apple.x;
	let dy = snakeHead.y - apple.y;

	let distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < 15) {
		console.log("collided with apple");
		score++;
		addBody();

		apple.x = getRandomBetween(20, canvas.width - 20);
		apple.y = getRandomBetween(20, canvas.height - 20);
	}
}

function getOffset(direction, factor = 1) {
	switch (direction) {
		case north:
			return { x: 0, y: unit * factor };
		case south:
			return { x: 0, y: -unit * factor };
		case west:
			return { x: unit * factor, y: 0 };
		case east:
			return { x: -unit * factor, y: 0 };
	}

	return { x: 0, y: 0 };
}

function getRandomBetween(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isMobile() {
	try {
		if (
			/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(
				navigator.userAgent
			)
		) {
			return true;
		}
		return false;
	} catch (e) {
		console.log("Error in isMobile");
		return false;
	}
}
