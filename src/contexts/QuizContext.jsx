import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
	answer: null,
	highScore: 0,
	index: 0,
	points: 0,
	questions: [],
	// Valid statuses are active, error, finished, loading and ready.
	status: "loading",
	timeRemaining: null,
};

const SECONDS_PER_QUESTION = 30;

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
				timeRemaining: state.questions.length * SECONDS_PER_QUESTION,
			};
		case "tick":
			return {
				...state,
				timeRemaining: state.timeRemaining - 1,
				status: state.timeRemaining === 0 ? "finished" : state.status,
			};
		default:
			throw new Error("Unknown action.");
	}
}

function QuizProvider({ children }) {
	const [
		{ answer, highScore, index, points, questions, status, timeRemaining },
		dispatch,
	] = useReducer(reducer, initialState);

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
		<QuizContext.Provider
			value={{
				answer,
				dispatch,
				highScore,
				index,
				maxPoints,
				numQuestions,
				points,
				questions,
				timeRemaining,
				status,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);

	if (context === undefined)
		throw new Error("QuizContext used outside of QuizProvider!");

	return context;
}

export { QuizProvider, useQuiz };
