import React, { Component } from "react";
import { LineChart, BarChart } from "react-easy-chart";
import Chance from "chance";
const chance = new Chance();
const steps = 100;
const probabilityArray = [0.5, 0, 0.5];
const stepSizeArray = [-1, 0, 1];
let currentPosition = 0;
let simulations = 10000;

export class Task1 extends Component {
	state = {
		pathToRender: [],
		finalPlaceFrequencies: [],
		expectedAbsoluteValue: 0,
		average: 0,
	};

	runModel = () => {
		const newPath = [];
		let curPos = currentPosition;

		newPath.push({ x: curPos, y: 0 });

		for (let i = 0; i < steps; i++) {
			let nextStep = chance.weighted(stepSizeArray, probabilityArray);
			curPos = curPos + nextStep;
			newPath.push({ x: curPos, y: i + 1 });
		}

		return newPath;
	};

	runSim = () => {
		const pathToRender = [];
		const finalPlaces = [];

		// First path
		const firstPath = this.runModel();
		pathToRender.push(firstPath);
		finalPlaces.push(firstPath[firstPath.length - 1].x);

		// remaining paths whose only last positions will be saved
		for (let i = 0; i < simulations - 1; i++) {
			const newPath = this.runModel();
			finalPlaces.push(newPath[newPath.length - 1].x);
		}

		let sum = 0;
		let avg = 0;
		finalPlaces.forEach((data) => {
			avg += data;
			if (data < 0) {
				data = -data;
			}
			sum += data;
		});

		sum = sum / finalPlaces.length;
		avg = avg / finalPlaces.length;

		const finalPlaceFrequencies = [];
		const uniqueSet = new Set(finalPlaces);
		const done = [];
		[...uniqueSet].forEach((i) => {
			if (!done.includes(i)) {
				const finalTimeFrequency = {
					x: `${i}`,
					y: finalPlaces.filter((x) => x === i).length,
				};
				finalPlaceFrequencies.push(finalTimeFrequency);
				done.push(i);
			}
		});

		this.setState(() => ({
			pathToRender: pathToRender,
			finalPlaceFrequencies: finalPlaceFrequencies,
			expectedAbsoluteValue: sum,
			avg: avg,
		}));
	};

	render() {
		console.log(this.state.expectedAbsoluteValue);
		console.log(this.state.avg);

		return (
			<div>
				<button onClick={this.runSim}>Click me!</button>
				<LineChart
					axes
					axisLabels={{ x: "Position", y: "Steps" }}
					grid
					margin={{ top: 100, right: 0, bottom: 30, left: 100 }}
					data={
						this.state.pathToRender.length === 0
							? this.state.pathToRender
							: [this.state.pathToRender[0]]
					}
					width={500}
					height={500}
					// lineColors={["#33fga3", "cyan", "yellow", "blue", "green"]}
				/>
				{console.log(this.state.finalPlaceFrequencies)}

				<BarChart
					data={this.state.finalPlaceFrequencies}
					height={300}
					width={1000}
					xType={"linear"}
					xDomainRange={[`${-steps}`, `${steps}`]}
					axes
					axisLabels={{ x: "Distance from the start", y: "Frequencies" }}
					margin={{ top: 0, right: 0, bottom: 30, left: 100 }}
				/>
			</div>
		);
	}
}

// import React, { PureComponent } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// import Chance from "chance";
// const chance = new Chance();
// const path = [];
// const steps = 100;
// const probabilityArray = [0.5, 0.5, 0.5];
// const stepSizeArray = [-1, 0, 1];
// let currentPosition = 0;
// path.push({ x: 0, y: 0 });

// for (let i = 0; i < steps; i++) {
// 	let nextStep = chance.weighted(stepSizeArray, probabilityArray);
// 	currentPosition = currentPosition + nextStep;
// 	path.push({ x: currentPosition, y: i + 1 });
// }
// const data = [
// 	{
// 		name: "Page A",
// 		uv: 4000,
// 		pv: 2400,
// 		amt: 2400,
// 	},
// 	{
// 		name: "Page B",
// 		uv: 3000,
// 		pv: 1398,
// 		amt: 2210,
// 	},
// ];

// export class Task1 extends PureComponent {
// 	// static jsfiddleUrl = "https://jsfiddle.net/alidingling/xqjtetw0/";

// 	render() {
// 		return (
// 			<LineChart
// 				width={500}
// 				height={300}
// 				data={path}
// 				margin={{
// 					top: 5,
// 					right: 30,
// 					left: 20,
// 					bottom: 5,
// 				}}
// 				// layout="vertical"
// 			>
// 				<CartesianGrid strokeDasharray="3 3" />
// 				<XAxis allowDataOverflow />
// 				<YAxis type="number" dataKey="y" />
// 				<Tooltip />
// 				<Legend />
// 				<Line type="monotone" dataKey="y" stroke="#8884d8" />
// 			</LineChart>
// 		);
// 	}
// }
