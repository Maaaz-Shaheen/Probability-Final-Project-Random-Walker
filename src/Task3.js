import React, { Component } from "react";
import Sketch from "react-p5";
import Chance from "chance";

export class Task3 extends Component {
	x = 0;
	y = 0;
	chance = new Chance();

	toScale = 3;
	width = 200 * this.toScale;
	height = 200 * this.toScale;

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

		p5.point(this.x, this.y);

		// choosing next step size
		const pi = Math.PI;
		const stepSizes = [0 * this.toScale, 0.5 * this.toScale, 1 * this.toScale];
		const angles = [0, 0.5 * pi, pi, 1.5 * pi];

		let nextStepSize = this.chance.weighted(stepSizes, [0.3, 0.3, 0.3]);
		let nextAngle = this.chance.weighted(angles, [0.25, 0.25, 0.25, 0.25]);

		let nextX = this.x + nextStepSize * Math.cos(nextAngle);
		let nextY = this.y + nextStepSize * Math.sin(nextAngle);

		const distanceOfCurrentFromOrigin = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		const distanceOfNextFromOrigin = Math.sqrt(Math.pow(nextX, 2) + Math.pow(nextY, 2));

		if (distanceOfNextFromOrigin <= this.width / 2) {
			this.x = nextX;
			this.y = nextY;
		} else {
			nextStepSize = nextStepSize - (this.width / 2 - distanceOfCurrentFromOrigin);
			this.x = -this.x + nextStepSize * Math.cos(nextAngle);
			this.y = -this.y + nextStepSize * Math.sin(nextAngle);
		}

		p5.stroke(255, 255, 0);
		p5.strokeWeight(1 * this.toScale);

		p5.point(this.x, this.y);

		// NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
	};

	render() {
		return (
			<div className="canvas-container">
				<Sketch setup={this.setup} draw={this.draw} />
			</div>
		);
	}
}
