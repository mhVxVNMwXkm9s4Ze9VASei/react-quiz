function Progress({ answer, index, maxPoints, numQuestions, points }) {
	return (
		<header className="progress">
			<progress
				max={numQuestions}
				value={index + Number(answer !== null)}
			/>
			<p>
				Question <strong>{index + 1}</strong> / {numQuestions}
			</p>
			<p>
				<strong>{points}</strong> / {maxPoints}
			</p>
		</header>
	);
}

export default Progress;
