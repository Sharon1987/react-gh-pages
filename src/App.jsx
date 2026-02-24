// App.jsx
import { RouterProvider } from "react-router";
import { router } from "./router"; // 確保路徑正確
import "./assets/style.css";


function App() {
  return <RouterProvider router={router} />;
}

export default App;