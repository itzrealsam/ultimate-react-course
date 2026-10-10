function NextButton({
  questionIndex,
  numQuestions,
  selectedOptionIndex,
  dispatch,
  status,
}) {
  if (selectedOptionIndex === null) return null;

  if (status === "active" && questionIndex < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (status === "active" && questionIndex === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "quizFinished" })}
      >
        Finish
      </button>
    );

  // if (status === "finished")
  //   return (
  //     <button
  //       className="btn btn-ui"
  //       onClick={() => dispatch({ type: "quizRestarted" })}
  //     >
  //       Restart Quiz
  //     </button>
  //   );
}

export default NextButton;
