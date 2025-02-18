import { createBrowserRouter } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import { RouterProvider } from "react-router";
import { createTheme, CssBaseline } from "@mui/material";
import { green, purple } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import Welcome from "./Components/Users/Welcome";
import Login from "./Components/Login";

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: purple[700],
      },
      text:{
        primary:"#FFFFFF"
      },
      background: {
        default: "#0a000d",
      },
      secondary: {
        main: green[500],
      },
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/users",
      element: <Welcome />,
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
