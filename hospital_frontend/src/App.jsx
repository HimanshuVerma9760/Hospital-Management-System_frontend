import { createBrowserRouter } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import { RouterProvider } from "react-router";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}/>;
}
