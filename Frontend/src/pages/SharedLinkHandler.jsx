import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import fileService from "../features/files/fileService";

const SharedLinkHandler = () => {
  const { token } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Requirement: Users must be logged in
      toast.error("Please login to access this file");
      navigate("/login");
      return;
    }

    const validateLink = async () => {
      try {
        const file = await fileService.accessLink(token, user.token);
        toast.success(`Access granted: ${file.originalName}`);
        navigate("/"); // Redirect to dashboard to see the new file
      } catch (error) {
        toast.error("Invalid or expired link");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    validateLink();
  }, [user, token, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? <p>Validating access...</p> : <p>Redirecting...</p>}
    </div>
  );
};

export default SharedLinkHandler;
