import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function App() {
  return (
    <div>
     <RouterProvider router={router} />
    </div>
  );
}

export default App;
