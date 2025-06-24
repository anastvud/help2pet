import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-center">Help2Pet</div>
      <button className="navbar-logout" onClick={handleLogout}>
        Log out
      </button>
    </nav>
  );
}

export default Navbar;