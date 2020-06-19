import { Random } from "random-js";
const random = new Random();
export const runModel = (startPointA, startPointB, width, no_of_simulations) => {
	// get initial points
	let pi = Math.PI;
	let time = 0;
	let pointA = startPointA;
	let pointB = startPointB;
	const timesArr = [];

	for (let i = 0; i < no_of_simulations; i++) {
		time = 0;
		pointA = startPointA;
		pointB = startPointB;

		while (true) {
			if (time === 100000) {
				break;
			}
			let nextStepSizeA = random.realZeroToOneInclusive();
			let nextAngleA = (random.real(0, 360, false) * pi) / 180;
			let nextStepSizeB = random.realZeroToOneInclusive();
			let nextAngleB = (random.real(0, 360, false) * pi) / 180;

			let nextAX = pointA.x + nextStepSizeA * Math.cos(nextAngleA);
			let nextAY = pointA.y + nextStepSizeA * Math.sin(nextAngleA);
			let nextBX = pointB.x + nextStepSizeB * Math.cos(nextAngleB);
			let nextBY = pointB.y + nextStepSizeB * Math.sin(nextAngleB);

			const distanceOfCurrentAFromOrigin = Math.sqrt(
				Math.pow(pointA.x, 2) + Math.pow(pointB.x, 2)
			);
			const distanceOfCurrentBFromOrigin = Math.sqrt(
				Math.pow(pointB.x, 2) + Math.pow(pointB.x, 2)
			);
			const distanceOfNextAFromOrigin = Math.sqrt(Math.pow(nextBX, 2) + Math.pow(nextBY, 2));
			const distanceOfNextBFromOrigin = Math.sqrt(Math.pow(nextBX, 2) + Math.pow(nextBY, 2));

			if (distanceOfNextAFromOrigin <= width / 2) {
				pointA.x = nextAX;
				pointA.y = nextAY;
			} else {
				nextStepSizeA = nextStepSizeA - (width / 2 - distanceOfCurrentAFromOrigin);
				pointA.x = -pointA.x + nextStepSizeA * Math.cos(nextAngleA);
				pointA.y = -pointA.y + nextStepSizeA * Math.sin(nextAngleA);
			}

			if (distanceOfNextBFromOrigin <= width / 2) {
				pointB.x = nextBX;
				pointB.y = nextBY;
			} else {
				nextStepSizeB = nextStepSizeB - (width / 2 - distanceOfCurrentBFromOrigin);
				pointB.x = -pointB.x + nextStepSizeB * Math.cos(nextAngleB);
				pointB.y = -pointB.y + nextStepSizeB * Math.sin(nextAngleB);
			}

			const distance = Math.sqrt(
				Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
			);
			time += 1;

			if (distance <= 1) {
				timesArr.push(time);
				break;
			}
		}
	}
	postMessage(timesArr.length === 0 ? -1 : timesArr);
};
