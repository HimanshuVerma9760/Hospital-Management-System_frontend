import { Alert, Typography } from "@mui/material";
import { Link } from "react-router";

export default function Success() {
  return (
    <>
      <Typography variant="h4" align="center">
        <Alert severity="success">
          Your payment is successfull, kindly check here in{" "}
          <Link to='/users/appointments' style={{textDecoration:"none"}}>Appointment</Link> section
        </Alert>
      </Typography>
    </>
  );
}
