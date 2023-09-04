import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";

function Question() {
	const { answer, dispatch, index, questions } = useQuiz();
	const question = questions.at(index);
	return (
		<div>
			<h4>{question.question}</h4>
			<Options
				answer={answer}
				dispatch={dispatch}
				question={question}
			/>
		</div>
	);
}

export default Question;
