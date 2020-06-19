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
			if (time === 50000) {
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
		if (i % 50 === 0) {
			postMessage([i, timesArr]);
		}
	}
	postMessage([no_of_simulations, timesArr]);
};

// task9
export const makePoints = (no_of_people, width) => {
	let list_of_people = [];
	let infected = [];

	for (let i = 0; i < no_of_people; i++) {
		const radius = (width / 2) * Math.sqrt(random.realZeroToOneInclusive());
		const theta = random.realZeroToOneInclusive() * 2 * Math.PI;
		list_of_people.push({
			x: radius * Math.cos(theta),
			y: radius * Math.sin(theta),
			direction: (random.real(0, 360, false) * Math.PI) / 180,
			status: "healthy",
		});
	}
	list_of_people[list_of_people.length - 1].status = "infected";
	infected.push(list_of_people[list_of_people.length - 1]);
	let time = 0;

	postMessage(["peopleList", list_of_people, time]);

	let counter = 0;

	while (true) {
		const newLocations = list_of_people.map((person) => {
			let nextStepSize = random.realZeroToOneInclusive();
			let nextAngle = (random.real(0, 360, false) * Math.PI) / 180;

			let nextX = person.x + nextStepSize * Math.cos(person.direction);
			let nextY = person.y + nextStepSize * Math.sin(person.direction);

			// let nextX = person.x + nextStepSize * Math.cos(nextAngle);
			// let nextY = person.y + nextStepSize * Math.sin(nextAngle);

			const newPersonObj = {
				...person,
				x: nextX,
				y: nextY,
			};
			const distanceOfCurrentFromOrigin = Math.sqrt(
				Math.pow(newPersonObj.x, 2) + Math.pow(newPersonObj.y, 2)
			);

			const distanceOfNextAFromOrigin = Math.sqrt(Math.pow(nextX, 2) + Math.pow(nextY, 2));

			if (distanceOfNextAFromOrigin <= width / 2) {
				newPersonObj.x = nextX;
				newPersonObj.y = nextY;
			} else {
				nextStepSize = nextStepSize - (width / 2 - distanceOfCurrentFromOrigin);
				newPersonObj.x = -newPersonObj.x + nextStepSize * Math.cos(person.direction);
				newPersonObj.y = -newPersonObj.y + nextStepSize * Math.sin(person.direction);
			}

			let infectedFlag = false;

			if (newPersonObj.status !== "infected") {
				for (let i = 0; i < infected.length; i++) {
					const infectedPerson = infected[i];
					const distance = Math.sqrt(
						Math.pow(infectedPerson.x - newPersonObj.x, 2) +
							Math.pow(infectedPerson.y - newPersonObj.y, 2)
					);
					if (distance <= 20) {
						newPersonObj.status = "infected";
						// let oldDirection = newPersonObj.direction;
						// newPersonObj.direction = infectedPerson.direction;
						// infectedPerson.direction = oldDirection;
						infectedFlag = true;
						break;
					}
				}
			}

			if (infectedFlag) {
				infected.push(newPersonObj);
			}

			return newPersonObj;
		});

		time++;

		// let allPossibleInfected = false;

		// while (!allPossibleInfected) {
		// 	for (let i = 0; i < infected.length; i++) {
		// 		const infected = infected[i];

		// 	}

		// }

		list_of_people = newLocations;
		counter++;

		if (counter === 20) {
			counter = 0;
			postMessage(["peopleList", newLocations, time]);
		}

		if (infected.length === no_of_people) {
			break;
		}

		// new_infected = list_of_people.map((person)=>{
		// 	if (new_infected.)
		// });

		// const distance = Math.sqrt(
		// 	Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
		// );
		// time += 1;

		// if (distance <= 1) {
		// 	timesArr.push(time);
		// 	break;
		// }
	}
};

// postMessage(["peopleList", newLocations]);
// list_of_people = newLocations;
// 	}
// };

// // get initial points
// let pi = Math.PI;
// let time = 0;
// let pointA = startPointA;
// let pointB = startPointB;
// const timesArr = [];

// for (let i = 0; i < no_of_simulations; i++) {
// 	time = 0;
// 	pointA = startPointA;
// 	pointB = startPointB;

// 	while (true) {
// 		if (time === 50000) {
// 			break;
// 		}

// 		let nextStepSizeA = random.realZeroToOneInclusive();
// 		let nextStepSizeB = random.realZeroToOneInclusive();
// 		let nextAngleB = (random.real(0, 360, false) * pi) / 180;

// 		let nextAX = pointA.x + nextStepSizeA * Math.cos(nextAngleA);
// 		let nextAY = pointA.y + nextStepSizeA * Math.sin(nextAngleA);
// 		let nextBX = pointB.x + nextStepSizeB * Math.cos(nextAngleB);
// 		let nextBY = pointB.y + nextStepSizeB * Math.sin(nextAngleB);

// 		const distanceOfCurrentAFromOrigin = Math.sqrt(
// 			Math.pow(pointA.x, 2) + Math.pow(pointB.x, 2)
// 		);
// 		const distanceOfCurrentBFromOrigin = Math.sqrt(
// 			Math.pow(pointB.x, 2) + Math.pow(pointB.x, 2)
// 		);
// 		const distanceOfNextAFromOrigin = Math.sqrt(Math.pow(nextBX, 2) + Math.pow(nextBY, 2));
// 		const distanceOfNextBFromOrigin = Math.sqrt(Math.pow(nextBX, 2) + Math.pow(nextBY, 2));

// 		if (distanceOfNextAFromOrigin <= width / 2) {
// 			pointA.x = nextAX;
// 			pointA.y = nextAY;
// 		} else {
// 			nextStepSizeA = nextStepSizeA - (width / 2 - distanceOfCurrentAFromOrigin);
// 			pointA.x = -pointA.x + nextStepSizeA * Math.cos(nextAngleA);
// 			pointA.y = -pointA.y + nextStepSizeA * Math.sin(nextAngleA);
// 		}

// 		if (distanceOfNextBFromOrigin <= width / 2) {
// 			pointB.x = nextBX;
// 			pointB.y = nextBY;
// 		} else {
// 			nextStepSizeB = nextStepSizeB - (width / 2 - distanceOfCurrentBFromOrigin);
// 			pointB.x = -pointB.x + nextStepSizeB * Math.cos(nextAngleB);
// 			pointB.y = -pointB.y + nextStepSizeB * Math.sin(nextAngleB);
// 		}

// const distance = Math.sqrt(
// 	Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
// );
// time += 1;

// if (distance <= 1) {
// 	timesArr.push(time);
// 	break;
// }
// 	}
// 	if (i % 50 === 0) {
// 		postMessage([i, timesArr]);
// 	}
// }
// postMessage([no_of_simulations, timesArr]);
