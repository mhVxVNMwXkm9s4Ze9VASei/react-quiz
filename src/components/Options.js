function Options({ question }) {
	return (
		<div>
			<div className="options">
				{question.options.map((option) => (
					<button
						key={option}
						className="btn btn-option"
					>
						{option}
					</button>
				))}
			</div>
		</div>
	);
}

export default Options;
