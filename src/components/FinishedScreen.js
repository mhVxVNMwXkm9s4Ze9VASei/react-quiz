function FinishedScreen({ maxPoints, points }) {
	const percentage = (points / maxPoints) * 100;

	return (
		<p className="result">
			You scored <strong>{points}</strong> out of {maxPoints} ({percentage}%)!
		</p>
	);
}

export default FinishedScreen;
