import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import {
  CircularProgress,
  createTheme,
  CssBaseline,
  Grid2,
  Skeleton,
  Typography,
} from "@mui/material";
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
import Profile from "./Components/Users/User/Profile";
import "./App.css";
import Dashboard from "./Components/Users/Dashboard";
import Prescriptions from "./Components/Users/Prescriptions/Prescriptions";
import AddPrescription from "./Components/Users/Prescriptions/AddPrescription";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http";
import { DoctorSecurityLoader } from "./util/doctorSecurityLoaders/DoctorSecurityLoader";
import { RouteAuthLoader } from "./util/routeAuthGuard/RouteAuthLoader";

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
      id: "rootUser",
      loader: RouteAuthLoader,
      element: <Welcome />,
      hydrateFallbackElement: (
        <Skeleton width="70%" height={500} sx={{ margin: "auto" }} />
      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "doctors",
          loader: DoctorSecurityLoader,
          hydrateFallbackElement: (
            <Skeleton width="70%" height={500} sx={{ margin: "auto" }} />
          ),
          element: <Doctors />,
        },
        {
          path: "doctors/add",
          loader: DoctorSecurityLoader,
          hydrateFallbackElement: (
            <Skeleton width="70%" height={500} sx={{ margin: "auto" }} />
          ),
          element: <AddDoctor />,
        },
        {
          path: "doctors/edit",
          loader: DoctorSecurityLoader,
          element: <EditDoctor />,
        },
        {
          path: "hospitals",
          loader: DoctorSecurityLoader,
          hydrateFallbackElement: (
            <Skeleton width="70%" height={500} sx={{ margin: "auto" }} />
          ),
          element: <Hospitals />,
        },
        {
          path: "hospitals/add",
          loader: DoctorSecurityLoader,
          hydrateFallbackElement: (
            <Skeleton width="70%" height={500} sx={{ margin: "auto" }} />
          ),
          element: <AddHospital />,
        },
        {
          path: "hospitals/edit",
          loader: DoctorSecurityLoader,
          hydrateFallbackElement: (
            <Skeleton width="70%" height={500} sx={{ margin: "auto" }} />
          ),
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
          path: "prescriptions",
          element: <Prescriptions />,
        },
        {
          path: "prescriptions/create",
          element: <AddPrescription />,
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
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
