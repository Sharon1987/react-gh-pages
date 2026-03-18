import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
const checkAdmin = async () => {
          try {
               const response = await axios.post(`${API_BASE}api/user/check`);
              console.log(response.data);
            setIsAuth(true);
            
          } catch (error) {
              setIsAuth(false);
          } finally {
              setLoading(false);
          };
          
    }

    // 檢查登入狀態
	  const token = document.cookie
	    .split("; ")
	    .find((row) => row.startsWith("hexToken="))
	    ?.split("=")[1];
	
	  if (token) {
	    axios.defaults.headers.common.Authorization = token;
	  }
	  
     
    checkAdmin();
  }, []);

  if (loading) return <RotatingLines />; // 載入中，避免跳轉
  if (!isAuth) return <Navigate to="/login" />;
  if (isAuth) return children;
}

export default ProtectedRoute;