import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import { createTheme, CssBaseline } from "@mui/material";
import { grey } from "@mui/material/colors";
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
import EditHospital from "./Components/Users/Hospitals/EditHospital";
import Orders from "./Components/Users/Appointments/Orders";
import Forms from "./Components/Users/Appointments/FormBuilder/Forms";
import CreateForm from "./Components/Users/Appointments/FormBuilder/CreateForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// import Forms from "./Components/Users/Appointments/FormBuilder/Forms";

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
        {
          path: "forms",
          element: <Forms />,
        },
        {
          path: "forms/create",
          element: <CreateForm />,
        },
        {
          path: "orders",
          element: <Orders />,
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
