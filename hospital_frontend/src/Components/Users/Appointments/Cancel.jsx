import { Typography } from "@mui/material";
import { useEffect } from "react";

export default function Cancel() {
  async function cancelAppointment() {}
  useEffect(() => {
    cancelAppointment();
  }, []);
  return (
    <>
      <Typography variant="h4" align="center">
        Cancel
      </Typography>
    </>
  );
}
