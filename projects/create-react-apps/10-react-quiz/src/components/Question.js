import { useQuiz } from "../contexts/QuizContext";
import Options from "./Options";

function Question() {
  const { questions, questionIndex, selectedOptionIndex } = useQuiz();
  const {
    question: questionText,
    options,
    correctOption,
  } = questions[questionIndex];

  return (
    <div>
      <h3>{questionText}</h3>
      <Options
        options={options}
        correctOption={correctOption}
        selectedOptionIndex={selectedOptionIndex}
      />
    </div>
  );
}

export default Question;
