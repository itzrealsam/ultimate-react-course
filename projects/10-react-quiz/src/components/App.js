import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";

const initialState = {
  questions: [],
  questionIndex: 0,
  selectedOptionIndex: null,
  status: "loading",
  error: "",
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "fetchFailed":
      return { ...state, status: "error", error: action.payload };
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "quizStarted":
      return { ...state, status: "active" };
    case "optionSelected":
      const question = state.questions[state.questionIndex];
      const isCorrect = question.correctOption === action.payload;
      return {
        ...state,
        selectedOptionIndex: action.payload,
        points: isCorrect ? state.points + question.points : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        selectedOptionIndex: null,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, questionIndex, selectedOptionIndex, status, error } =
    state;
  const numQuestions = questions.length;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:8000/questions", {
          signal: controller.signal,
        });

        if (!response.ok)
          throw new Error("Something went wrong with fetching questions");

        const data = await response.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        // Catch both the standard AbortError name and the native string message
        if (
          err.name === "AbortError" ||
          err.message.includes("signal is aborted")
        ) {
          return; // Do absolutely nothing if the request was intentionally cancelled
        }

        dispatch({ type: "fetchFailed", payload: err.message });
      }
    }

    fetchQuestions();

    return () => controller.abort();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error error={error} />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Question
              question={questions[questionIndex]}
              selectedOptionIndex={selectedOptionIndex}
              dispatch={dispatch}
            />
            <NextButton
              selectedOptionIndex={selectedOptionIndex}
              dispatch={dispatch}
            />
          </>
        )}
      </Main>
    </div>
  );
}
