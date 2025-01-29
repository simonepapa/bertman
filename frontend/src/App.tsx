import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ReadArticles from "./pages/ReadArticles";
import Solutions from "./pages/Solutions";
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
    },
    {
      path: "/solutions",
      element: (
        <Navbar>
          <Solutions />
        </Navbar>
      )
    },
    {
      path: "/read-articles",
      element: (
        <Navbar>
          <ReadArticles />
        </Navbar>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
