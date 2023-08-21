import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
	index: 0,
	questions: [],
	// Valid statuses are active, error, finished, loading and ready.
	status: "loading",
};

function reducer(state, action) {
	switch (action.type) {
		case "dataFailed":
			return {
				...state,
				status: "error",
			};
		case "dataReceived":
			return {
				...state,
				status: "ready",
				questions: action.payload,
			};
		case "start":
			return {
				...state,
				status: "active",
			};
		default:
			throw new Error("Unknown action.");
	}
}

export default function App() {
	const [{ index, questions, status }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const numQuestions = questions.length;

	useEffect(() => {
		fetch("http://localhost:8000/questions")
			.then((res) => res.json())
			.then((data) =>
				dispatch({
					payload: data,
					type: "dataReceived",
				})
			)
			.catch((error) => dispatch({ type: "dataFailed" }));
	}, []);

	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen
						dispatch={dispatch}
						numQuestions={numQuestions}
					/>
				)}
				{status === "active" && <Question question={questions[index]} />}
			</Main>
		</div>
	);
}
