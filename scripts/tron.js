if (!isMobile()) {
	console.log("non-mobile detected");
	$("body").on("keydown", (e) => {
		press(e.key);
	});
} else {
	console.log("mobile detected");
	callback = press;
}

const canvas = $("canvas")[0];
const context = canvas.getContext("2d");
const tickSpeed = 40;
const speed = 0.2;
const enemySpeed = 0.17;
const cycleSize = 20;
const lineWidth = 12;

//#region Directions
const none = { x: 0, y: 0, isX: false };
// y
const north = { x: 0, y: 1, isX: false };
const south = { x: 0, y: -1, isX: false };
// x
const west = { x: -1, y: 0, isX: true };
const east = { x: 1, y: 0, isX: true };
//#endregion

class Cycle {
	x = 0;
	y = 0;
	direction = none;
	locations = [];
	alive = true;

	constructor(color) {
		this.color = color;
	}

	tick(deltaTime) {
		this.x += deltaTime * speed * this.direction.x;
		this.y -= deltaTime * speed * this.direction.y;
	}

	getLocation() {
		return { x: this.x, y: this.y };
	}
}

let currentEnemyCount = 0;

class EnemyCycle extends Cycle {
	constructor(color, x, y) {
		super(color);
		this.x = x;
		this.y = y;
		this.index = currentEnemyCount++;
		this.speed = getRandomBetween(enemySpeed / 2, enemySpeed);
	}

	tick(deltaTime) {
		this.x += deltaTime * enemySpeed * this.direction.x;
		this.y -= deltaTime * enemySpeed * this.direction.y;

		let dx = player.x - this.x;
		let dy = player.y - this.y;

		let oldDirection = this.direction;

		if (Math.abs(dx) > Math.abs(dy)) {
			this.direction =
				dx > 0
					? this.direction == west
						? this.direction
						: east
					: this.direction == east
					? this.direction
					: west;
		} else {
			this.direction =
				dy > 0
					? this.direction == north
						? this.direction
						: south
					: this.direction == south
					? this.direction
					: north;
		}

		if (this.direction != oldDirection) {
			this.locations.push(this.getLocation());
		}
	}
}

const player = new Cycle("blue");
player.x = 300;
player.y = 200;
const enemies = [
	new EnemyCycle("red", getRandomBetween(300, 500), getRandomBetween(100, 200)),
	new EnemyCycle("red", getRandomBetween(25, 150), getRandomBetween(100, 200)),
	new EnemyCycle("red", getRandomBetween(200, 300), getRandomBetween(300, 500)),
];

let deltaTime = 0;
let isPlaying = false;
let isOver = false;
let startDate = null;
let lastTick;
let directionChanged = false;

$(function () {
	setInterval(tick, 1000 / tickSpeed);
});

function tick() {
	render();

	if (!isPlaying || isOver) {
		return;
	} else if (!player.alive) {
		setTimeout(() => {
			isOver = true;
		}, 1000);
	}

	if (!startDate) {
		startDate = new Date();
	}

	let now = performance.now();

	if (!lastTick) {
		lastTick = now;
	}

	deltaTime = now - lastTick;
	lastTick = now;

	player.tick(deltaTime);

    if (enemies.length == 0) {
        isOver = true;
        return;
    }

	for (let enemy of enemies) {
		enemy.tick(deltaTime);
	}

	checkCollision();
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (player.alive) {
		let location = player.getLocation();

		// console.log(player.locations);

		for (let i = 0; i < player.locations.length; i++) {
			let currentLocation = player.locations[i];
			let nextLocation = location;

			if (player.locations[i + 1]) {
				nextLocation = player.locations[i + 1];
			}

			context.strokeStyle = player.color;
			context.lineWidth = lineWidth;

			context.beginPath();
			context.moveTo(currentLocation.x, currentLocation.y);
			context.lineTo(nextLocation.x, nextLocation.y);
			context.closePath();
			context.stroke();
		}

		context.fillStyle = player.color;
		// console.log(location);
		context.fillRect(location.x - cycleSize / 2, location.y - cycleSize / 2, cycleSize, cycleSize);
		// context.fillRect(0, 0, 20, 20);
	}

	for (let enemy of enemies) {
		let location = enemy.getLocation();

		for (let i = 0; i < enemy.locations.length; i++) {
			let currentLocation = enemy.locations[i];
			let nextLocation = location;

			if (enemy.locations[i + 1]) {
				nextLocation = enemy.locations[i + 1];
			}

			context.strokeStyle = enemy.color;
			context.lineWidth = lineWidth;

			context.beginPath();
			context.moveTo(currentLocation.x, currentLocation.y);
			context.lineTo(nextLocation.x, nextLocation.y);
			context.closePath();
			context.stroke();
		}

		context.fillStyle = enemy.color;
		// console.log(location);
		context.fillRect(location.x - cycleSize / 2, location.y - cycleSize / 2, cycleSize, cycleSize);
	}

	if (isOver) {
		context.font = "36px Common Pixel";
		context.fillStyle = "white";
		context.fillText("Game Over", canvas.width / 3, canvas.height / 2);
	}
}

function checkCollision() {
	if (!player.alive) {
		return;
	}

	let location = player.getLocation();

	if (
		location.x < 0 ||
		location.x > canvas.width ||
		location.y < 0 ||
		location.y > canvas.height.x < 0 ||
		location.x > canvas.width ||
		location.y < 0 ||
		location.y > canvas.height
	) {
		console.log("player out of bounds");
		player.alive = false;
		return;
	}

	for (let enemy of enemies) {
		if (enemy.x < 0 || enemy.x > canvas.width || enemy.y < 0 || enemy.y > canvas.height) {
			console.log("enemy out of bounds");
			removeEnemy(enemy);
			continue;
		}

		if (distance(player, enemy) < cycleSize / 2) {
			console.log("player collided with enemy");
			player.alive = false;
			return;
		}

		for (let i = 0; i < enemy.locations.length; i++) {
			if (!enemy.locations[i + 1]) {
				break;
			}

			let currentLocation = enemy.locations[i];
			let nextLocation = enemy.locations[i + 1];

			let offset = lineWidth / 2;

			let maxX = Math.max(currentLocation.x, nextLocation.x) + offset;
			let minX = Math.min(currentLocation.x, nextLocation.x) - offset;

			let maxY = Math.max(currentLocation.y, nextLocation.y) + offset;
			let minY = Math.min(currentLocation.y, nextLocation.y) - offset;

			if (location.x < maxX && location.x > minX && location.y < maxY && location.y > minY) {
				console.log("player collided with enemy");
				player.alive = false;
			}

			/* let selfLocation = enemy.getLocation();

            if (selfLocation.x < maxX && selfLocation.x > minX && selfLocation.y < maxY && selfLocation.y > minY) {
                console.log("enemy collided with self, removing");
                removeEnemy(enemy);
            } */
		}
	}

	for (let i = 0; i < player.locations.length; i++) {
		if (!player.locations[i + 1]) {
			break;
		}

		let currentLocation = player.locations[i];
		let nextLocation = player.locations[i + 1];

		let offset = lineWidth / 2;

		let maxX = Math.max(currentLocation.x, nextLocation.x) + offset;
		let minX = Math.min(currentLocation.x, nextLocation.x) - offset;

		let maxY = Math.max(currentLocation.y, nextLocation.y) + offset;
		let minY = Math.min(currentLocation.y, nextLocation.y) - offset;

		if (location.x < maxX && location.x > minX && location.y < maxY && location.y > minY) {
			if (directionChanged) {
				directionChanged = false;
			} else {
				console.log("player collided with player");
				player.alive = false;
			}
		}

		for (let enemy of enemies) {
			let enemyLocation = enemy.getLocation();

			if (enemyLocation.x < maxX && enemyLocation.x > minX && enemyLocation.y < maxY && enemyLocation.y > minY) {
				console.log("enemy collided with player, removing");
				removeEnemy(enemy);
			}
		}
	}
}

function removeEnemy(enemyCycle) {
	enemies.splice(enemies.indexOf(enemyCycle), 1);
}

function distance(cycleA, cycleB) {
	let x = Math.pow(cycleA.x - cycleB.x, 2);
	let y = Math.pow(cycleA.y - cycleB.y, 2);

	return Math.sqrt(x + y);
}

function getRandomBetween(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function press(key) {
	let toPush = null;

	switch (key) {
		case "ArrowLeft":
			toPush = player.direction == east ? null : west;
			break;
		case "ArrowRight":
			toPush = player.direction == west ? null : east;
			break;
		case "ArrowUp":
			toPush = player.direction == south ? null : north;
			break;
		case "ArrowDown":
			toPush = player.direction == north ? null : south;
			break;
		default:
			break;
	}

	if (!toPush && player.direction != toPush) {
		return;
	}

	player.direction = toPush;
	isPlaying = true;
	directionChanged = true;
	player.locations.push({ x: player.x, y: player.y });
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
