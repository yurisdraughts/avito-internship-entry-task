import "../styles/Root.scss";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <header className="header">header</header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">footer</footer>
    </>
  );
}
