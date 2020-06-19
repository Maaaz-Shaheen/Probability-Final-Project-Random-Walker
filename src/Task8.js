import React, { Component } from "react";
import Sketch from "react-p5";
import Chance from "chance";
import { Random } from "random-js";
import worker from "workerize-loader!./worker"; // eslint-disable-line import/no-webpack-loader-syntax

export class Task8 extends Component {
	state = {
		start: false,
		data: [0],
	};
	instance = new worker();

	componentWillUnmount = () => {
		this.instance.terminate();
	};

	startWorker = () => {
		this.instance.onmessage = (e) => {
			if (!isNaN(e.data[0])) {
				this.setState(() => ({
					data: e.data,
				}));
				// console.log(e.data);
			}
		};
	};

	chance = new Chance();
	random = new Random();
	toScale = 3;
	width = 200 * this.toScale;
	height = 200 * this.toScale;

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

	runSim = () => {
		this.startWorker();
		this.instance.runModel(this.startPointA, this.startPointB, this.width, 5000);
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
		p5.background(60);
		p5.translate(this.width / 2, this.height / 2);
		p5.scale(1, -1);
		p5.circle(0, 0, this.circleRadius * 2); // 200 is the diameter
		p5.frameRate(1000);
	};
	draw = (p5) => {
		// making point and placing it in center (0, 0)
		p5.translate(this.width / 2, this.height / 2);
		p5.scale(1, -1);

		// current point
		p5.stroke(255, 0, 0);
		p5.strokeWeight(1 * this.toScale);

		p5.point(this.pointA.x, this.pointA.y);
		p5.point(this.pointB.x, this.pointB.y);

		// choosing next step size
		const pi = Math.PI;

		let nextStepSizeA = this.random.realZeroToOneInclusive();
		let nextAngleA = (this.random.real(0, 360, false) * pi) / 180;
		let nextStepSizeB = this.random.realZeroToOneInclusive();
		let nextAngleB = (this.random.real(0, 360, false) * pi) / 180;

		let nextAX = this.pointA.x + nextStepSizeA * Math.cos(nextAngleA);
		let nextAY = this.pointA.y + nextStepSizeA * Math.sin(nextAngleA);
		let nextBX = this.pointB.x + nextStepSizeB * Math.cos(nextAngleB);
		let nextBY = this.pointB.y + nextStepSizeB * Math.sin(nextAngleB);

		const distanceOfCurrentAFromOrigin = Math.sqrt(
			Math.pow(this.pointA.x, 2) + Math.pow(this.pointA.y, 2)
		);
		const distanceOfCurrentBFromOrigin = Math.sqrt(
			Math.pow(this.pointB.x, 2) + Math.pow(this.pointB.y, 2)
		);
		const distanceOfNextAFromOrigin = Math.sqrt(Math.pow(nextAX, 2) + Math.pow(nextAY, 2));
		const distanceOfNextBFromOrigin = Math.sqrt(Math.pow(nextBX, 2) + Math.pow(nextBY, 2));

		if (distanceOfNextAFromOrigin <= this.width / 2) {
			this.pointA.x = nextAX;
			this.pointA.y = nextAY;
		} else {
			nextStepSizeA = nextStepSizeA - (this.width / 2 - distanceOfCurrentAFromOrigin);
			this.pointA.x = -this.pointA.x + nextStepSizeA * Math.cos(nextAngleA);
			this.pointA.y = -this.pointA.y + nextStepSizeA * Math.sin(nextAngleA);
		}

		if (distanceOfNextBFromOrigin <= this.width / 2) {
			this.pointB.x = nextBX;
			this.pointB.y = nextBY;
		} else {
			nextStepSizeB = nextStepSizeB - (this.width / 2 - distanceOfCurrentBFromOrigin);
			this.pointB.x = -this.pointB.x + nextStepSizeB * Math.cos(nextAngleB);
			this.pointB.y = -this.pointB.y + nextStepSizeB * Math.sin(nextAngleB);
		}

		p5.stroke(255, 255, 0);
		p5.strokeWeight(1 * this.toScale);
		p5.point(this.pointA.x, this.pointA.y);
		p5.point(this.pointB.x, this.pointB.y);

		const distance = Math.sqrt(
			Math.pow(this.pointA.x - this.pointB.x, 2) + Math.pow(this.pointA.y - this.pointB.y, 2)
		);

		if (distance <= 1) {
			p5.stroke(0, 0, 255);
			p5.strokeWeight(2 * this.toScale);
			p5.point(this.pointA.x, this.pointA.y);
			p5.point(this.pointB.x, this.pointB.y);
			p5.noLoop();
		}

		// NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
	};

	render() {
		return (
			<div>
				<h1>No of simulations done: {this.state.data[0]} / 5000</h1>
				{this.state.data[1] && (
					<div>
						<h2>Total simulations which met: {this.state.data[1].length} </h2>
					</div>
				)}
				<button onClick={this.toggleStart}>Run Sim</button>
				{this.state.start && (
					<div className="canvas-container">
						<Sketch setup={this.setup} draw={this.draw} />
					</div>
				)}
			</div>
		);
	}
}
