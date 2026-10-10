function Options({ options, selectedOptionIndex, correctOption, dispatch }) {
  const hasAnswered = selectedOptionIndex !== null;

  return (
    <div className="options">
      {options.map((option, index) => {
        const isSelected = index === selectedOptionIndex;
        const isCorrect = index === correctOption;

        const className = [
          "btn",
          "btn-option",
          isSelected && "answer",
          hasAnswered && isCorrect && "correct",
          hasAnswered && isSelected && !isCorrect && "wrong",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            className={className}
            key={option}
            onClick={() =>
              dispatch({
                type: "optionSelected",
                payload: index,
              })
            }
            disabled={hasAnswered}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
