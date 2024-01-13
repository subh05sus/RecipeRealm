import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { loginWithPopup, logout, isAuthenticated, user } = useAuth0();
  if (isAuthenticated) {
    console.log(user);
  }
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none'}}>
        <div className="logo">Recipe<span className="logoRealm">Realm</span></div>
      </Link>

      <div className="auth-buttons">
        {isAuthenticated ? (
          <Link to="/profile" style={{ textDecoration: 'none' , color:'white'}}>
            <span>{user.name}</span>
          </Link>
        ) : (
          <span></span>
        )}

        {isAuthenticated ? (
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        ) : (
          <button onClick={() => loginWithPopup()}>Log In</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
