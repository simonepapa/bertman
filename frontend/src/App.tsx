import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LabelArticles from "./pages/LabelArticles";
import Methodology from "./pages/Methodology";
import ReadArticles from "./pages/ReadArticles";
import Solutions from "./pages/Solutions";
import { SnackbarProvider } from "notistack";
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
    },
    {
      path: "/label-articles",
      element: (
        <Navbar>
          <LabelArticles />
        </Navbar>
      )
    },
    {
      path: "/methodology",
      element: (
        <Navbar>
          <Methodology />
        </Navbar>
      )
    }
  ]);

  return (
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
}

export default App;
