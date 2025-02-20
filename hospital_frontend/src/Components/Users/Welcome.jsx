import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  CssBaseline,
  Box,
  Skeleton,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Grid2,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { ListAltOutlined, LocalHospital, Logout, Person } from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router";
import useAuth from "../../util/useAuth";
import { deepOrange } from "@mui/material/colors";

const drawerWidth = 240;

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
    navigate("/");
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {/* <Typography variant="h6" fontWeight="bold" marginBottom="10px" align="center">
            HashStudioz
        </Typography> */}
        <Toolbar />
        <Typography
          variant="p"
          fontWeight="bold"
          paddingLeft="20px"
          marginBottom="15px"
        >
          Main menu
        </Typography>
        <List sx={{ paddingLeft: "1rem", marginRight: "1rem" }}>
          <Link to="/users" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </Link>
          <Link to="doctors" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton>
              <ListItemIcon>
                <ListAltOutlined />
              </ListItemIcon>
              <ListItemText primary="Doctors" />
            </ListItemButton>
          </Link>
          <Link
            to="hospitals"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <LocalHospital />
              </ListItemIcon>
              <ListItemText primary="Hospitals" />
            </ListItemButton>
          </Link>
          <Link
            to="patients"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Patients" />
            </ListItemButton>
          </Link>
          {/* <Link to='hospitals' style={{ textDecoration: "none", color: "black" }}> */}
          <ListItemButton onClick={logoutHandler}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
          {/* </Link> */}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid2 display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Hospital Management System
          </Typography>
          <Link style={{ textDecoration: "none" }}>
            <Avatar
              sx={{ bgcolor: deepOrange[500] }}
              alt="Remy Sharp"
              src="/broken-image.jpg"
            >
              B
            </Avatar>
          </Link>
        </Grid2>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
