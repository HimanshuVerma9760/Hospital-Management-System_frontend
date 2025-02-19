import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import { createTheme, CssBaseline } from "@mui/material";
import { cyan } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import Welcome from "./Components/Users/Welcome";
import Login from "./Components/Login";
import Doctors from "./Components/Users/Doctors";
import Hospitals from "./Components/Users/Hospitals";

export default function App() {
  const theme = createTheme({
    palette: {
      background: {
        default: cyan[50],
      },
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/users",
      element: <Welcome />,
      children: [
        {
          path: "doctors",
          element: <Doctors/>
        },
        {
          path: "hospitals",
          element: <Hospitals/>
        },
      ],
    },
  ]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
