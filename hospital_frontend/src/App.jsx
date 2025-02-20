import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import { createTheme, CssBaseline } from "@mui/material";
import { cyan } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import Welcome from "./Components/Users/Welcome";
import Login from "./Components/Login";
import Doctors from "./Components/Users/Doctors/Doctors";
import Hospitals from "./Components/Users/Hospitals/Hospitals";
import AddHospital from "./Components/Users/Hospitals/AddHospital";
import AddDoctor from "./Components/Users/Doctors/AddDoctor";
import Patients from "./Components/Users/Patients/Patients";
import AddPatient from "./Components/Users/Patients/AddPatient";

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
          element: <Doctors />,
        },
        {
          path: "doctors/add",
          element: <AddDoctor />,
        },
        {
          path: "hospitals",
          element: <Hospitals />,
        },
        {
          path: "hospitals/add",
          element: <AddHospital />,
        },
        {
          path: "patients",
          element: <Patients />,
        },
        {
          path: "patients/add",
          element: <AddPatient />,
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
