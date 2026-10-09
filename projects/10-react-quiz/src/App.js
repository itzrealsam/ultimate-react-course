import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState = {
  questions: [],
  status: "loading",
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "fetchFailed":
      return { ...state, status: "error", error: action.payload };
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, error } = state;

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
        if (err.name !== "AbortError") {
          dispatch({ type: "fetchFailed", payload: err.message });
        }
      }
    }

    fetchQuestions();

    return () => controller.abort();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p>❌ Error: {error}</p>}
        {status === "ready" && (
          <>
            <p>1/{questions?.length}</p>
            <p>Question?</p>
          </>
        )}
      </Main>
    </div>
  );
}
