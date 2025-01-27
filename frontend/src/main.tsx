import "./index.css";
import TestRoom from "./pages/TestRoom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  //{
  //  path: "/",
  //  element: < />
  //},
  {
    path: "/testroom",
    element: <TestRoom />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
