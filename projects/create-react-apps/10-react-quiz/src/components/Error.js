function Error({ error }) {
  return (
    <p className="error">
      <span>💥</span> {error ? error : "There was an error fecthing questions."}
    </p>
  );
}

export default Error;
