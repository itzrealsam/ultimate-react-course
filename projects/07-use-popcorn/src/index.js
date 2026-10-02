import React from "react";
import ReactDOM from "react-dom/client";
// import StarRating from "./StarRating";
import "./index.css";
import App from "./App";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);

//   return (
//     <div>
//       <StarRating
//         maxRating={5}
//         color={"blue"}
//         messages={["terrible", "bad", "okay", "good", "awesome"]}
//         size={16}
//         defaultRating={3}
//         onSetRating={setMovieRating}
//       />
//       <p>{`This movie got ${movieRating} ${movieRating > 1 ? "ratings" : "rating"}.`}</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating />
    <StarRating maxRating={10} />
    <StarRating
      maxRating={5}
      color={"red"}
      messages={["terrible", "bad", "okay", "good", "awesome"]}
      size={16}
    />
    <Test /> */}
  </React.StrictMode>,
);
