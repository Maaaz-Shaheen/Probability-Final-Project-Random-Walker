import React, { Component } from "react";
import Sketch from "react-p5";
import Chance from "chance";
import { Random } from "random-js";
import { LineChart } from "react-easy-chart"; // eslint-disable-line import/no-webpack-loader-syntax
import worker from "workerize-loader!./worker"; // eslint-disable-line import/no-webpack-loader-syntax

export class Task9 extends Component {
	state = {
		start: false,
		peopleList: [],
		timeData: [],
	};

	instance = new worker();
	chance = new Chance();
	random = new Random();

	toScale = 3;
	width = 200 * this.toScale;
	height = 200 * this.toScale;

	no_of_people = 300;

	componentWillUnmount = () => {
		this.instance.terminate();
	};

	calculateRandomXY = () => {
		const radius = (this.width / 2) * Math.sqrt(this.random.realZeroToOneInclusive());
		const theta = this.random.realZeroToOneInclusive() * 2 * Math.PI;
		return {
			x: radius * Math.cos(theta),
			y: radius * Math.sin(theta),
		};
	};

	startPointA = this.calculateRandomXY();
	startPointB = this.calculateRandomXY();

	pointA = this.startPointA;
	pointB = this.startPointB;

	countInfected = (currentData) => {
		let infected = 0;
		currentData.forEach((person) => {
			if (person.status === "infected") {
				infected++;
			}
		});
		return infected;
	};

	startWorker = () => {
		this.instance.onmessage = (e) => {
			if (e.data[0] === "peopleList") {
				if (Math.floor(e.data[2] / 100) - this.state.timeData.length > 1) {
					let infectedNo = this.countInfected(e.data[1]);
					this.setState((prevState) => ({
						peopleList: e.data[1],
						timeData: [
							...prevState.timeData,
							{
								x: Math.floor(e.data[2] / 100),
								y: infectedNo,
							},
						],
					}));
				}
				console.log(e.data);
			}
		};
	};

	runSim = () => {
		this.startWorker();
		this.instance.makePoints(this.no_of_people, this.width);
		// const oneResult = this.runModel();
	};

	toggleStart = () => {
		if (!this.state.start) {
			this.runSim();
		}
		this.setState((prevState) => ({
			start: !prevState.start,
		}));
	};

	setup = (p5, canvasParentRef) => {
		p5.createCanvas(this.width, this.height).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
	};
	draw = (p5) => {
		p5.background(60);
		p5.frameRate(100);

		// making point and placing it in center (0, 0)
		p5.translate(this.width / 2, this.height / 2);
		p5.scale(1, -1);

		// current point
		p5.strokeWeight(1 * this.toScale);

		for (let i = 0; i < this.state.peopleList.length; i++) {
			const person = this.state.peopleList[i];
			if (person.status === "healthy") {
				p5.stroke(0, 255, 0);
			} else if (person.status === "infected") {
				p5.stroke(255, 0, 0);
			}
			p5.point(person.x, person.y);
		}

		// // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
	};

	render() {
		return (
			<div>
				{/* <h1>No of simulations done: {this.state.data[0]}</h1> */}
				<button onClick={this.toggleStart}>Run Sim</button>
				{this.state.start && (
					<div className="canvas-container">
						<Sketch setup={this.setup} draw={this.draw} />
						<LineChart
							axes
							width={500}
							height={250}
							data={[this.state.timeData]}
							axisLabels={{ x: "Time", y: "Infected" }}
						/>
					</div>
				)}
			</div>
		);
	}
}
