import { Grid2, Skeleton, Typography } from "@mui/material";
import CheckoutButton from "./CheckoutButton";
import { useEffect, useState } from "react";
const Conn = import.meta.env.VITE_CONN_URI;

export default function CheckoutPage({ order }) {
  const [isLoading, setIsLoading] = useState(true);
  const [myAppointment, setMyAppointment] = useState("");

  async function fetchAppointmentDetails() {
    const response = await fetch(`${Conn}/appointments/get`, {
      headers: {
        id: order.appointment_id,
      },
    });
    if (response.ok) {
      const result = await response.json();
      console.log(result.result);
      setMyAppointment(result.result);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchAppointmentDetails();
  }, []);
  if(isLoading){
    return (
        <Skeleton variant="rectangular" height={300}/>
    )
  }
  return (
    <>
      <Grid2 >
        <Typography variant="h4" align="center">
          Bill Information
        </Typography>
        <Grid2 display="flex" gap="1rem">
          <Typography variant="h6" fontWeight="bold">Name:</Typography>
          <Typography variant="p" alignSelf="center">{myAppointment.patientName}</Typography>
        </Grid2>
        <Grid2 display="flex" gap="1rem">
          <Typography variant="h6" fontWeight="bold">Billing email:</Typography>
          <Typography variant="p" alignSelf="center">{myAppointment.patientEmail}</Typography>
        </Grid2>
        <Grid2 display="flex" gap="1rem">
          <Typography variant="h6" fontWeight="bold">Suffering from:</Typography>
          <Typography variant="p" alignSelf="center">{myAppointment.disease.name}</Typography>
        </Grid2>
        <Grid2 display="flex" gap="1rem">
          <Typography variant="h6" fontWeight="bold">Selected hospital:</Typography>
          <Typography variant="p" alignSelf="center">{myAppointment.hospital.name}</Typography>
        </Grid2>
        <Grid2 display="flex" gap="1rem">
          <Typography variant="h6" fontWeight="bold">Preferred doctor:</Typography>
          <Typography variant="p" alignSelf="center">{myAppointment.doctor.name}</Typography>
        </Grid2>
        <Grid2 display="flex" gap="1rem">
          <Typography variant="h6" fontWeight="bold">Amount payable:</Typography>
          <Typography variant="p" alignSelf="center">Rs {order.amount} only</Typography>
        </Grid2>

        <CheckoutButton order={order} />
      </Grid2>
    </>
  );
}
