import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/dashboard" className="navbar__brand">
          Diabetes Tracker
        </NavLink>

        <div className="navbar__links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/readings"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Readings
          </NavLink>

          <NavLink
            to="/add-reading"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Add Reading
          </NavLink>
        </div>

        <div className="navbar__actions">
          <span className="navbar__user">{user?.username}</span>
          <button onClick={handleLogout} className="navbar__logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
