import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { setAuthToken } from "./axiosInstane";
import { useEffect } from "react";

function App() {

  // useEffect(() => {
  //   const token = localStorage.getItem("echotoken");
  //   if (token) {
  //     setAuthToken(token);
  //   }
  // }, []);

  return (
    <div>
     <RouterProvider router={router} />
    </div>
  );
}

export default App;
