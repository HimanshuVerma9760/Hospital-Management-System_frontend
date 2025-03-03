import { Forward } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid2,
  Icon,
  Typography,
} from "@mui/material";
import { useState } from "react";
const Conn = import.meta.env.VITE_CONN_URI;

const CheckoutButton = ({ order }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const response = await fetch(`${Conn}/payment/checkout`, {
      method: "POST",
      body: JSON.stringify({ order: order }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <Button
      variant={loading ? "" : "contained"}
      onClick={handleCheckout}
      disabled={loading}
      sx={{ marginTop: "1rem" }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid2 display="flex" gap="1rem">
          <Typography>Proceed to payment</Typography>
          <Icon sx={{ display: "flex", justifyContent: "center" }}>
            <Forward />
          </Icon>
        </Grid2>
      )}
    </Button>
  );
};

export default CheckoutButton;
