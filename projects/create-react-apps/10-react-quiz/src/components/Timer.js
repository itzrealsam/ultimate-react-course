import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

function Timer() {
  const { secondsRemaining, showTick } = useQuiz();
  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const id = setInterval(() => {
      showTick();
    }, 1000);

    return () => clearInterval(id);
  }, [showTick, secondsRemaining]);
  return (
    <div className="timer">
      {minutes} : {seconds}
    </div>
  );
}

export default Timer;
