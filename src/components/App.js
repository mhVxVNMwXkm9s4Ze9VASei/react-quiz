import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";

const initialState = {
	answer: null,
	highScore: 0,
	index: 0,
	points: 0,
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
		case "finished":
			return {
				...state,
				status: "finished",
				highScore:
					state.points > state.highScore ? state.points : state.highScore,
			};
		case "newAnswer":
			const question = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case "nextQuestion":
			return {
				...state,
				answer: null,
				index: state.index + 1,
			};
		case "restart":
			return {
				...initialState,
				highScore: state.highScore,
				questions: state.questions,
				status: "ready",
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
	const [{ answer, highScore, index, points, questions, status }, dispatch] =
		useReducer(reducer, initialState);

	const numQuestions = questions.length;
	const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

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
				{status === "active" && (
					<>
						<Progress
							answer={answer}
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPoints={maxPoints}
						/>
						<Question
							answer={answer}
							dispatch={dispatch}
							question={questions[index]}
						/>
						<NextButton
							answer={answer}
							dispatch={dispatch}
							index={index}
							numQuestions={numQuestions}
						/>
					</>
				)}
				{status === "finished" && (
					<FinishedScreen
						dispatch={dispatch}
						highScore={highScore}
						maxPoints={maxPoints}
						points={points}
					/>
				)}
			</Main>
		</div>
	);
}
