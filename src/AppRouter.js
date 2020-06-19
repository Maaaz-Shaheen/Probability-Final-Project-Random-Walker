import React from "react";
import { BrowserRouter as Router, Route, Switch, NavLink } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { Task1 } from "./Task1";
import { Task2 } from "./Task2";
import { Task3 } from "./Task3";
import { Task4 } from "./Task4";
import { Task5 } from "./Task5";
import { Task7 } from "./Task7";
import { Task8 } from "./Task8";

const Header = () => (
	<header>
		<h1>Portfolio</h1>
		<NavLink to="/">Task 1</NavLink>
		<br />
		<NavLink to="/task2">Task 2</NavLink>
		<br />

		<NavLink to="/task3">Task 3</NavLink>
		<br />

		<NavLink to="/task4">Task 4</NavLink>
		<br />

		<NavLink to="/task5">Task 5/6</NavLink>
		<br />

		<NavLink to="/task7">Task 7</NavLink>
		<br />

		<NavLink to="/task8">Task 8</NavLink>
	</header>
);

const AppRouter = () => (
	<Router>
		<div>
			<Header />
			<Switch>
				<Route path="/" component={Task1} exact={true} />
				<Route path="/task2" component={Task2} exact={true} />
				<Route path="/task3" component={Task3} exact={true} />
				<Route path="/task4" component={Task4} exact={true} />
				<Route path="/task5" component={Task5} exact={true} />
				<Route path="/task7" component={Task7} exact={true} />
				<Route path="/task8" component={Task8} exact={true} />

				<Route component={NotFoundPage} />
			</Switch>
		</div>
	</Router>
);

export default AppRouter;
