import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState = {
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
				question: action.payload,
			};
		default:
			throw new Error("Unknown action.");
	}
}

export default function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
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
				<p>1/15</p>
				<p>Question?</p>
			</Main>
		</div>
	);
}
