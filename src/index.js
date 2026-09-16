import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import pizzaData from "./data";

function Header() {
  // const style = {
  //   color: "red",
  //   fontSize: "48px",
  //   textTransform: "uppercase",
  // };
  const style = {};

  return (
    <header className="header">
      <h1 style={style}>Fast React Pizza Co.</h1>
    </header>
  );
}

function Pizza(props) {
  return (
    <li className="pizza">
      <img src={props.pizzaObj.photoName} alt={props.pizzaObj.name} />
      <div>
        <h3>{props.pizzaObj.name}</h3>
        <p>{props.pizzaObj.ingredients}</p>
        <span>${props.pizzaObj.price.toFixed(2)}</span>
      </div>
    </li>
  );
}

function Menu() {
  const numPizzas = pizzaData.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {numPizzas > 0 ? (
        <ul className="pizzas">
          {pizzaData.map((pizza) => (
            <Pizza pizzaObj={pizza} key={pizza.name} />
          ))}
        </ul>
      ) : (
        <p>We're sorry, but we don't have any pizzas available right now.</p>
      )}
    </main>
  );
}

function Footer() {
  const todayDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const hour = new Date().getHours();
  const openHour = 8;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;
  console.log(isOpen);

  return (
    <footer className="footer">
      {isOpen ? (
        <div className="order">
          <p>{`${todayDate} ${currentTime}.`}</p>
          <p>
            We're currently open until {closeHour}:00. Come visit us or order
            online.
          </p>
          <button className="btn">Order Now</button>
        </div>
      ) : (
        <div className="order">
          <p>{`${todayDate} ${currentTime}.`}</p>
          <p>
            We're happy to welcome you between {openHour}:00 and {closeHour}
            :00. Come visit us or order online.
          </p>
          {/* <button className="btn">Order Now</button> */}
        </div>
      )}
    </footer>
  );
}

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

// React v18 and above uses createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// React v17 and below
// ReactDOM.render(<App />, document.getElementById("root"));
