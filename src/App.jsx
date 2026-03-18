// App.jsx
import { RouterProvider } from "react-router";
import { router } from "./router"; // 確保路徑正確
import "./assets/style.css";
import MessageToast from "./components/MessageToast";


function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}

export default App;