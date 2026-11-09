import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const createInitialState = () => ({
  questions: [],
  questionIndex: 0,
  selectedOptionIndex: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 300,
  status: "loading",
  error: "",
});

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
        points: isCorrect
          ? state.points + (question.points || 0)
          : state.points,
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
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.points, state.highscore),
      };
    }
    case "quizRestarted": {
      return {
        ...createInitialState(),
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };
    }
    case "tick": {
      if (state.status !== "active" || state.secondsRemaining <= 0)
        return state;

      const secondsRemaining = state.secondsRemaining - 1;
      const isTimeUp = secondsRemaining === 0;

      return {
        ...state,
        secondsRemaining,
        status: isTimeUp ? "finished" : state.status,
        highscore: isTimeUp
          ? Math.max(state.points, state.highscore)
          : state.highscore,
      };
    }
    default:
      throw new Error(`Action type "${action.type}" is unknown.`);
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuestions() {
      try {
        // const response = await fetch("http://localhost:8000/questions", {
        //   signal: controller.signal,
        // });
        const response = await fetch(
          `${process.env.PUBLIC_URL || ""}/data/questions.json`,
          {
            signal: controller.signal,
          },
        ); // for GitHub Pages
        if (!response.ok)
          throw new Error("Something went wrong with fetching questions");

        const data = await response.json();
        dispatch({ type: "dataReceived", payload: data.questions });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

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

  const numQuestions = state.questions.length;
  const maxPoints = state.questions.reduce((prev, cur) => prev + cur.points, 0);

  function startQuiz() {
    dispatch({ type: "quizStarted" });
  }

  function selectOption(index) {
    dispatch({
      type: "optionSelected",
      payload: index,
    });
  }

  function nextQuestion() {
    dispatch({ type: "nextQuestion" });
  }

  function showTick() {
    dispatch({ type: "tick" });
  }

  function finishQuiz() {
    dispatch({ type: "quizFinished" });
  }

  function restartQuiz() {
    dispatch({ type: "quizRestarted" });
  }

  const contextValue = () => ({
    ...state,
    numQuestions,
    maxPoints,
    startQuiz,
    selectOption,
    nextQuestion,
    showTick,
    finishQuiz,
    restartQuiz,

    dispatch,
  });

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error(
      "QuizContext was used outside QuizProvider. useQuiz must be used within a QuizProvider",
    );

  return context;
}

export { QuizProvider, useQuiz };
