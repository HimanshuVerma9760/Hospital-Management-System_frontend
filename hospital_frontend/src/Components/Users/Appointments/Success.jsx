import { Alert, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router";

export default function Success() {
  useEffect(() => {
    localStorage.setItem("as", true);
  }, []);
  return (
    <>
      <Typography variant="h4" align="center">
        <Alert severity="success">
          Your payment is successfull, kindly check here in{" "}
          <Link to="/users/appointments/create" style={{ textDecoration: "none" }}>
            Appointment
          </Link>{" "}
          section
        </Alert>
      </Typography>
    </>
  );
}
