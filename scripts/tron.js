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
const enemySpeed = 0.2;
const cycleSize = 20;
const lineWidth = 12;

//#region Directions
const none = { x: 0, y: 0, isX: false, useZero: false };
// y
const north = { x: 0, y: 1, isX: false, useZero: true };
const south = { x: 0, y: -1, isX: false, useZero: false };
// x
const west = { x: -1, y: 0, isX: true, useZero: true };
const east = { x: 1, y: 0, isX: true, useZero: false };
const directions = [north, south, west, east];
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
	lastRayCheck = performance.now();
	shouldRay = false;

	constructor(color, x, y) {
		super(color);
		this.x = x;
		this.y = y;
		this.index = currentEnemyCount++;
		this.speed = getRandomBetween(enemySpeed / 2, enemySpeed);
		this.direction = east;
		this.locations.push(this.getLocation());
	}

	bestTurn() {
		let possible;

		switch (this.direction) {
			case west:
			case east:
				possible = [north, south];
				break;
			case north:
			case south:
				possible = [west, east];
				break;
		}

		let directionA = possible[0];
		let directionB = possible[1];
		let ray = new Ray(this.x, this.y, null, null);

		ray.setDirection(directionA);
		let result = ray.cast(player);
		let rayDistanceA = result != null ? result.distance : 0;
		let distanceA =
			(directionA.useZero
				? directionA.isX
					? this.x
					: this.y
				: directionA.isX
				? Math.abs(canvas.width - this.x)
				: Math.abs(canvas.height - this.y)) - rayDistanceA;

		ray.setDirection(directionB);
		result = ray.cast(player);
		let rayDistanceB = result != null ? result.distance : 0;
		let distanceB =
			(directionB.useZero
				? directionB.isX
					? this.x
					: this.y
				: directionB.isX
				? Math.abs(canvas.width - this.x)
				: Math.abs(canvas.height - this.y)) - rayDistanceB;

		if (rayDistanceA < 50 && rayDistanceB >= 50) {
			return directionB;
		} else if (rayDistanceA >= 50 && rayDistanceB < 50) {
			return directionA;
		}

		return distanceA > directionB
			? directionA
			: distanceB > distanceA
			? directionB
			: Math.random() > 0.5
			? directionA
			: directionB;
	}

	tick(deltaTime) {
		let possibleX = this.x + deltaTime * 2 * enemySpeed * this.direction.x;
		let possibleY = this.y - deltaTime * 2 * enemySpeed * this.direction.y;
		let ray = new Ray(possibleX, possibleY, null, null);
		ray.setDirection(this.direction);
		let result = ray.cast(player);
		let oldDirection = this.direction;
		let isNotValid =
			possibleX < 50 ||
			possibleX > canvas.width - 50 ||
			possibleY < 50 ||
			possibleY > canvas.height - 50 ||
			(result != null && result.distance < 50);

		if (isNotValid || Math.random() > 0.97) {
			let next = this.bestTurn();

			if (!next) {
				return;
			}

			this.direction = next;
		}

		if (this.direction != oldDirection) {
			this.locations.push(this.getLocation());
		}

		this.x += deltaTime * enemySpeed * this.direction.x;
		this.y -= deltaTime * enemySpeed * this.direction.y;
	}
}

class Ray {
	constructor(originX, originY, directionX, directionY) {
		this.originX = originX;
		this.originY = originY;
		this.directionX = directionX;
		this.directionY = directionY;
	}

	setDirection(direction) {
		this.directionX = direction.x;
		this.directionY = direction.y;
	}

	normalize() {
		let length = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
		this.directionX /= length;
		this.directionY /= length;
	}

	getOrigin() {
		return { x: this.originX, y: this.originY };
	}

	cast(cycle) {
		let x4 = this.originX + this.directionX;
		let y4 = this.originY + this.directionY;

		let traced = [];

		for (let i = 0; i < cycle.locations.length; i++) {
			let currentLocation = cycle.locations[i];
			let nextLocation = cycle.locations[i + 1];

			if (nextLocation == null) {
				nextLocation = cycle.getLocation();
			}

			let offset = lineWidth / 2;

			let x2 = Math.max(currentLocation.x, nextLocation.x) + offset;
			let x1 = Math.min(currentLocation.x, nextLocation.x) - offset;

			let y2 = Math.max(currentLocation.y, nextLocation.y) + offset;
			let y1 = Math.min(currentLocation.y, nextLocation.y) - offset;

			let denominator = (x1 - x2) * (this.originY - y4) - (y1 - y2) * (this.originX - x4);

			if (!denominator) {
				continue;
			}

			let numerator = (x1 - this.originX) * (this.originY - y4) - (y1 - this.originY) * (this.originX - x4);
			let t = numerator / denominator;
			numerator = (x1 - x2) * (y1 - this.originY) - (y1 - y2) * (x1 - this.originX);
			let u = -numerator / denominator;

			if (!(t > 0 && t < 1 && u > 0)) {
				continue;
			}

			let x = x1 + t * (x2 - x1);
			let y = y1 + t * (y2 - y1);
			let point = { x: x, y: y };

			traced.push({ location: currentLocation, point: point, distance: distance(this.getOrigin(), point) });
		}

		traced.sort((a, b) => (a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0));
		return traced[0];
	}
}

const player = new Cycle("blue");
player.x = 400;
player.y = 200;
const enemies = [new EnemyCycle("red", 200, 300)];

let deltaTime = 0;
let isPlaying = false;
let isOver = false;
let startDate = null;
let lastTick;
let directionChanged = false;
let lastPress = performance.now();

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

	if (enemies.length == 0) {
		isOver = true;
		return;
	}

	for (let enemy of enemies) {
		enemy.tick(deltaTime);
	}

	player.tick(deltaTime);

	checkCollision();
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (player.alive) {
		let location = player.getLocation();

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
		context.fillRect(location.x - cycleSize / 2, location.y - cycleSize / 2, cycleSize, cycleSize);
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
		context.fillRect(location.x - cycleSize / 2, location.y - cycleSize / 2, cycleSize, cycleSize);
	}

	if (isOver) {
		context.font = "36px Common Pixel";
		context.fillStyle = "white";
		context.fillText(player.alive ? "You won" : "You lost", canvas.width / 3, canvas.height / 2);
	}
}

function checkCollision() {
	if (!player.alive) {
		return;
	}

	let location = player.getLocation();

	if (location.x < 0 || location.x > canvas.width || location.y < 0 || location.y > canvas.height) {
		console.log("player out of bounds");
		player.alive = false;
		return;
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

		let ray = new Ray(player.x, player.y, null, null);
		ray.setDirection(player.direction);
		let result = ray.cast(enemy);

		if (result != null && result.distance < cycleSize) {
			console.log("player collided with enemy");
			player.alive = false;
			return;
		}

		ray = new Ray(enemy.x, enemy.y, null, null);
		ray.setDirection(enemy.direction);
		result = ray.cast(player);

		if (result != null && result.distance < cycleSize) {
			console.log("enemy collided with player, removing");
			removeEnemy(enemy);
			return;
		}
	}
}

function removeEnemy(enemyCycle) {
	enemies.splice(enemies.indexOf(enemyCycle), 1);
}

function distance(a, b) {
	let x = Math.pow(a.x - b.x, 2);
	let y = Math.pow(a.y - b.y, 2);

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

	if ((!toPush && player.direction != toPush) || performance.now() - lastPress < 120) {
		return;
	}

	player.direction = toPush;
	isPlaying = true;
	directionChanged = true;
	lastPress = performance.now();

	for (let enemy of enemies) {
		enemy.shouldRay = true;
	}

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
