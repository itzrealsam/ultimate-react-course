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

function Pizza({ pizzaObj }) {
  // if (pizzaObj.soldOut) return null;
  const isSoldOut = pizzaObj.soldOut ? "sold-out" : "";

  return (
    <li className={`pizza ${isSoldOut}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>
          {pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price.toFixed(2)}`}
        </span>
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
        <>
          <p>
            Authentic Italian cuisine. 6 creative dishes to choose from. All
            from our stone oven, all organic, all delicious.
          </p>
          <ul className="pizzas">
            {pizzaData.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}
          </ul>
        </>
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
      <Order
        isOpen={isOpen}
        todayDate={todayDate}
        currentTime={currentTime}
        openHour={openHour}
        closeHour={closeHour}
      />
    </footer>
  );
}

function Order({ isOpen, todayDate, currentTime, openHour, closeHour }) {
  return isOpen ? (
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
