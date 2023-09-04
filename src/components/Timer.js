import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

function Timer() {
	const { dispatch, timeRemaining } = useQuiz();
	const mins = Math.floor(timeRemaining / 60);
	const seconds = timeRemaining % 60;
	useEffect(() => {
		const id = setInterval(() => {
			dispatch({ type: "tick" });
		}, 1000);

		return () => clearInterval(id);
	}, [dispatch]);
	return (
		<div class="timer">
			{mins < 10 && "0"}
			{mins}:{seconds < 10 && "0"}
			{seconds}
		</div>
	);
}

export default Timer;
