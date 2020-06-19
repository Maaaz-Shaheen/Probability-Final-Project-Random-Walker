import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import { Task1 } from "./Task1";
// import { Task2 } from "./Task2";
// import { Task3 } from "./Task3";
// import { Task4 } from "./Task4";
// import { Task5 } from "./Task5";
// import { Task7 } from "./Task7";
// import { Task8 } from "./Task8";
import AppRouter from "./AppRouter";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
	<React.StrictMode>
		{/* <Task1 /> */}
		{/* <Task2 /> */}
		{/* <Task3 /> */}
		{/* <Task4 /> */}
		{/* <Task5 /> */}
		{/* <Task7 /> */}
		{/* <Task3Sketch /> */}
		{/* <Task8 /> */}
		<AppRouter />
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
