import Options from "./Options";

function Question({ question, selectedOptionIndex, dispatch }) {
  const { question: questionText, options, correctOption, id } = question;

  return (
    <div>
      <h3>{questionText}</h3>
      <Options
        options={options}
        correctOption={correctOption}
        selectedOptionIndex={selectedOptionIndex}
        dispatch={dispatch}
      />
    </div>
  );
}

export default Question;
