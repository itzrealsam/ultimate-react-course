import { useQuiz } from "../contexts/QuizContext";

function Progress() {
  const {
    questionIndex,
    numQuestions,
    selectedOptionIndex,
    points,
    maxPoints,
  } = useQuiz();

  return (
    <header className="progress">
      <progress
        value={questionIndex + Number(selectedOptionIndex !== null)}
        max={numQuestions}
      ></progress>

      <p>
        Question <strong>{questionIndex + 1}</strong> / {numQuestions}
      </p>

      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </header>
  );
}

export default Progress;
