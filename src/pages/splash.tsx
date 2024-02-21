import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Splash Page</h1>
    </div>
  );
}
