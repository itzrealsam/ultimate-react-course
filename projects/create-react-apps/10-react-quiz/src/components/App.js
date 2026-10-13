import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  questions: [],
  questionIndex: 0,
  selectedOptionIndex: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 300,
  status: "loading",
  error: "",
};

const SEC_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "fetchFailed": {
      return { ...state, status: "error", error: action.payload };
    }
    case "dataReceived": {
      return { ...state, questions: action.payload, status: "ready" };
    }
    case "quizStarted": {
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    }
    case "optionSelected": {
      if (state.selectedOptionIndex !== null) {
        return state;
      }

      const question = state.questions[state.questionIndex];
      if (!question) {
        return state;
      }

      const isCorrect = question.correctOption === action.payload;

      return {
        ...state,
        selectedOptionIndex: action.payload,
        points: isCorrect ? state.points + question.points : state.points,
      };
    }
    case "nextQuestion": {
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        selectedOptionIndex: null,
      };
    }
    case "quizFinished": {
      const newHighscore = state.points > state.highscore;
      return {
        ...state,
        status: "finished",
        highscore: newHighscore ? state.points : state.highscore,
      };
    }
    case "quizRestarted": {
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };
    }
    case "tick": {
      if (state.status !== "active" || state.secondsRemaining <= 0) {
        return state;
      }

      const secondsRemaining = state.secondsRemaining - 1;
      const timerElapsed = secondsRemaining === 0;
      const newHighscore = timerElapsed && state.points > state.highscore;

      return {
        ...state,
        secondsRemaining,
        status: timerElapsed ? "finished" : state.status,
        highscore: newHighscore ? state.points : state.highscore,
      };
    }
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    questionIndex,
    selectedOptionIndex,
    points,
    highscore,
    secondsRemaining,
    status,
    error,
  } = state;

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

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
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        dispatch({
          type: "fetchFailed",
          payload:
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while fetching questions",
        });
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
            <Progress
              questionIndex={questionIndex}
              numQuestions={numQuestions}
              selectedOptionIndex={selectedOptionIndex}
              points={points}
              maxPoints={maxPoints}
            />
            <Question
              question={questions[questionIndex]}
              selectedOptionIndex={selectedOptionIndex}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                questionIndex={questionIndex}
                numQuestions={numQuestions}
                selectedOptionIndex={selectedOptionIndex}
                dispatch={dispatch}
                status={status}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
