import Options from "./Options";

function Question({ question }) {
  console.log(question);
  const { question: questionText, options, id } = question;

  return (
    <div>
      <h3>{questionText}</h3>
      <Options options={options} />
    </div>
  );
}

export default Question;
