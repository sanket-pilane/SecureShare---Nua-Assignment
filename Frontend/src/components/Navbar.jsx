import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FaSignOutAlt, FaUserCircle, FaShieldAlt } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import Button from "./ui/Button";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-blue-600/20 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FaShieldAlt size={20} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SecureShare
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-300">
                <div className="p-1.5 bg-slate-800 rounded-full text-slate-400">
                  <FaUserCircle size={18} />
                </div>
                <span>{user.name}</span>
              </div>

              <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2"
              >
                <FaSignOutAlt />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
