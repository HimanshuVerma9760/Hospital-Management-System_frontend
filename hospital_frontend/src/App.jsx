import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import { createTheme, CssBaseline } from "@mui/material";
import { cyan, grey} from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import Welcome from "./Components/Users/Welcome";
import Login from "./Components/Login";
import Doctors from "./Components/Users/Doctors/Doctors";
import Hospitals from "./Components/Users/Hospitals/Hospitals";
import AddHospital from "./Components/Users/Hospitals/AddHospital";
import AddDoctor from "./Components/Users/Doctors/AddDoctor";
import Patients from "./Components/Users/Patients/Patients";
import AddPatient from "./Components/Users/Patients/AddPatient";
import EditDoctor from "./Components/Users/Doctors/EditDoctor";
import CreateAppointments from "./Components/Users/Appointments/CreateAppointments";
import Appointments from "./Components/Users/Appointments/Appointments";
import Success from "./Components/Users/Appointments/Success";
import Cancel from "./Components/Users/Appointments/Cancel";
import CheckoutPage from "./Components/Users/Appointments/CheckoutPage";
import EditHospital from "./Components/Users/Hospitals/EditHospital";

export default function App() {
  const theme = createTheme({
    palette: {
      background: {
        default: grey[50],
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
          path: "doctors/edit",
          element: <EditDoctor />,
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
          path: "hospitals/edit",
          element: <EditHospital />,
        },
        {
          path: "patients",
          element: <Patients />,
        },
        {
          path: "patients/add",
          element: <AddPatient />,
        },
        {
          path: "appointments",
          element: <Appointments />,
        },
        {
          path: "appointments/create",
          element: <CreateAppointments />,
        },
      ],
    },
    {
      path: "/payment/success",
      element: <Success />,
    },
    {
      path: "/cancel",
      element: <Cancel />,
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
