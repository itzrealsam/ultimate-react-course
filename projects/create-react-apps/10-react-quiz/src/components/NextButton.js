import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const {
    questionIndex,
    numQuestions,
    selectedOptionIndex,
    status,
    nextQuestion,
    finishQuiz,
  } = useQuiz();

  if (selectedOptionIndex === null) return null;

  if (status === "active" && questionIndex < numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => nextQuestion()}>
        Next
      </button>
    );

  if (status === "active" && questionIndex === numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => finishQuiz()}>
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
