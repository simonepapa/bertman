import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/dashboard" replace={true} />
    },
    {
      path: "/dashboard",
      element: (
        <Navbar>
          <Dashboard />
        </Navbar>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
