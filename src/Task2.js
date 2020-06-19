import React, { Component } from "react";
import { LineChart, BarChart } from "react-easy-chart";
import Chance from "chance";
const chance = new Chance();
const probabilityArray = [0.5, 0, 0.5];
const stepSizeArray = [-1, 0, 1];
let simulations = 1000;
const distance = 5;
const safeDistance = 2000;

export class Task2 extends Component {
	state = {
		pathsToRender: [],
		timeToMeetFrequencies: [],
	};

	runModelWithPathTracking = () => {
		const newPathA = [];
		const newPathB = [];
		let timePassed = 0;

		let curPosA = 0;
		let curPosB = curPosA + distance;

		newPathA.push({ x: curPosA, y: 0 });
		newPathB.push({ x: curPosB, y: 0 });

		while (curPosB - curPosA > 0) {
			let nextStepA = chance.weighted(stepSizeArray, probabilityArray);
			let nextStepB = chance.weighted(stepSizeArray, probabilityArray);

			curPosA = curPosA + nextStepA;
			curPosB = curPosB + nextStepB;

			newPathA.push({
				x: curPosA,
				y: timePassed + 1,
			});
			newPathB.push({
				x: curPosB,
				y: timePassed + 1,
			});

			timePassed += 1;
		}
		return [[newPathA, newPathB], timePassed];
	};

	runModelWithFinalTimeOnly = () => {
		let timePassed = 0;
		let curPosA = 0;
		let curPosB = curPosA + distance;

		while (curPosB - curPosA > 0) {
			let nextStepA = chance.weighted(stepSizeArray, probabilityArray);
			let nextStepB = chance.weighted(stepSizeArray, probabilityArray);

			curPosA = curPosA + nextStepA;
			curPosB = curPosB + nextStepB;

			timePassed += 1;
		}
		return timePassed;
	};
	runSim = () => {
		const [pathsToRender, timePassed] = this.runModelWithPathTracking();
		const finalTimes = [];
		finalTimes.push(timePassed);

		// remaining paths whose only last positions will be saved
		for (let i = 0; i < simulations - 1; i++) {
			const newPathTime = this.runModelWithFinalTimeOnly();
			finalTimes.push(newPathTime);
		}
		console.log(finalTimes);

		const timeToMeetFrequencies = [];
		const uniqueSet = new Set(finalTimes);

		const done = [];
		[...uniqueSet].forEach((i) => {
			if (!done.includes(i)) {
				const finalTimeFrequency = {
					x: `${i}`,
					y: finalTimes.filter((x) => x === i).length,
				};
				timeToMeetFrequencies.push(finalTimeFrequency);
				done.push(i);
			}
		});

		this.setState(() => ({
			pathsToRender: pathsToRender,
			timeToMeetFrequencies: timeToMeetFrequencies,
		}));
	};

	render() {
		return (
			<div>
				<button onClick={this.runSim}>Click me!</button>
				<LineChart
					axes
					axisLabels={{ x: "Position", y: "Steps" }}
					grid
					margin={{ top: 100, right: 0, bottom: 30, left: 100 }}
					data={this.state.pathsToRender.length === 0 ? [] : this.state.pathsToRender}
					width={500}
					height={500}
					// lineColors={["#33fga3", "cyan", "yellow", "blue", "green"]}
				/>
				{console.log(this.state.timeToMeetFrequencies)}

				<BarChart
					data={this.state.timeToMeetFrequencies}
					height={300}
					width={1000}
					xType={"linear"}
					xDomainRange={[`${-safeDistance}`, `${safeDistance}`]}
					axes
					axisLabels={{ x: "Time to meet", y: "Frequencies" }}
					margin={{ top: 0, right: 0, bottom: 200, left: 100 }}
				/>
			</div>
		);
	}
}
