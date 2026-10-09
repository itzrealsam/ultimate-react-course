function Header() {
  return (
    <header className="app-header">
      {/* Prepend the public URL variable before the filename */}
      <img src={process.env.PUBLIC_URL + "/logo512.png"} alt="React logo" />
      <h1>The React Quiz</h1>
    </header>
  );
}

export default Header;
