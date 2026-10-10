function NextButton({
  questionIndex,
  numQuestions,
  selectedOptionIndex,
  dispatch,
}) {
  if (selectedOptionIndex === null) return null;

  if (questionIndex < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (questionIndex === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "quizFinished" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
