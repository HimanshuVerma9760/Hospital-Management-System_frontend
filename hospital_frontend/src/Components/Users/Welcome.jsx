import {
  Alert,
  AppBar,
  Box,
  CssBaseline,
  Grid2,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../../util/useAuth";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function Welcome() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function checkAuth() {
      const userVerified = await useAuth();
      if (userVerified.response) {
        setIsVerified(true);
        setRole(userVerified.role);
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  function logoutHandler() {
    localStorage.clear();
    navigate("/login");
  }
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="text"
          width={100}
          height={40}
          sx={{ alignSelf: "center" }}
        />
        <Skeleton
          variant="circular"
          width={80}
          height={80}
          sx={{ alignSelf: "center" }}
        />
        <Skeleton
          variant="rectangular"
          width={210}
          height={300}
          sx={{ alignSelf: "center" }}
        />
      </Box>
    );
  } else if (!isVerified) {
    return (
      <Box sx={{ margin: "20px" }}>
        <Alert severity="error">
          You Are Not Authorised to view this page.
        </Alert>
      </Box>
    );
  }
  return (
    <>
      <AppBar>
        <Grid2>
          <Grid2 display="flex" justifyContent="space-around">
            <Typography variant="h4">Welcome {role}</Typography>
            <IconButton onClick={logoutHandler}>
              <Logout sx={{color:"white"}} />
            </IconButton>
          </Grid2>
        </Grid2>
      </AppBar>
    </>
  );
}
