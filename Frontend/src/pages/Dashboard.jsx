import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <p>Welcome back, {user.name}!</p>
      ) : (
        <p>Please log in to see your files.</p>
      )}
    </div>
  );
};

export default Dashboard;
