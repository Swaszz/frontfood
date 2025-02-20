import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
function App() {
  return (
    <RouterProvider router={router}>
      <ScrollToTop /> {/* ✅ Now inside RouterProvider */}
    </RouterProvider>
  );
}

export default App;
