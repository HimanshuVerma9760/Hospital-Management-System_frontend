import React, { useEffect, useRef, useState } from "react";
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
  ImageListItem,
  IconButton,
  Tooltip,
  MenuItem,
  Menu,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {
  Create,
  Dashboard,
  FormatAlignCenter,
  ListAltOutlined,
  ListAltRounded,
  LocalHospital,
  Logout,
  Notes,
  Person,
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import useAuth from "../../util/useAuth";
import { deepOrange, indigo } from "@mui/material/colors";
import ModalContent from "../Modal/ModalContent";
import { AnimatePresence, motion } from "motion/react";
const FOLDER_PATH = import.meta.env.VITE_FOLDER_URI;
const Conn = import.meta.env.VITE_CONN_URI;

const drawerWidth = 240;

export default function Welcome() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const nav = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePrompt = () => {
    setAnchorEl(null);
  };
  async function getUser(id) {
    const response = await fetch(`${Conn}/get/user/${id}`);
    if (response.ok) {
      const result = await response.json();
      if (result) {
        setProfilePicture(`${FOLDER_PATH}/uploads/dp/${result.result.dp}`);
      }
    } else {
      const result = await response.json();
      console.log(result.message);
    }
  }
  const isAdmin = useRef(false);
  useEffect(() => {
    async function checkAuth() {
      const userVerified = await useAuth();
      if (userVerified.response) {
        setIsVerified(true);
        if (
          userVerified.role === "Admin" ||
          userVerified.role === "Super-Admin"
        ) {
          isAdmin.current = true;
        }
        getUser(userVerified.userId);
      } else {
        setIsVerified(false);
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
    navigate("/");
    // return (
    // <Box sx={{ margin: "20px" }}>
    //   <Alert severity="error">
    //     You Are Not Authorised to view this page. Kindly{" "}
    //     <Link to="/">Login</Link>
    //   </Alert>
    // </Box>
    // );
  }
  function handleClose() {
    setShowPrompt(false);
  }
  if (showPrompt) {
    return (
      <ModalContent
        type="fileUpload"
        isOpen={showPrompt}
        onClose={handleClose}
        message={{
          message: "Select picture",
          caption: "Select your profile picture",
        }}
      />
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
        <ImageListItem sx={{ paddingBottom: "1.5rem" }}>
          <img
            style={{ height: "4.5rem", width: "5.5rem", margin: "auto" }}
            loading="lazy"
            src="/Hospitals.png"
            alt="hospital"
          />
        </ImageListItem>
        <Typography
          variant="h6"
          fontWeight="bold"
          paddingLeft="20px"
          marginBottom="14px"
          marginTop="14px"
        >
          Main menu
        </Typography>
        <List
          sx={{
            paddingLeft: "1rem",
            marginRight: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="dashboard"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                style={{ display: "flex", gap: "2rem" }}
                sx={
                  nav.pathname.split("/")[2] === "dashboard" && {
                    backgroundColor: "whitesmoke",
                  }
                }
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  <Dashboard />
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Dashboard
                </Typography>
              </ListItemButton>
            </Link>
          </motion.div>
          {isAdmin.current && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link
                  to="doctors"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItemButton
                    style={{ display: "flex", gap: "2rem" }}
                    sx={
                      nav.pathname.split("/")[2] === "doctors" && {
                        backgroundColor: "whitesmoke",
                      }
                    }
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                      <ListAltOutlined />
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                      Doctors
                    </Typography>
                  </ListItemButton>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Link
                  to="hospitals"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItemButton
                    style={{ display: "flex", gap: "2rem" }}
                    sx={
                      nav.pathname.split("/")[2] === "hospitals" && {
                        backgroundColor: "whitesmoke",
                      }
                    }
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                      <LocalHospital />
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                      Hospitals
                    </Typography>
                  </ListItemButton>
                </Link>
              </motion.div>
            </>
          )}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link
              to="patients"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                style={{ display: "flex", gap: "2rem" }}
                sx={
                  nav.pathname.split("/")[2] === "patients" && {
                    backgroundColor: "whitesmoke",
                  }
                }
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  <Person />
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  {" "}
                  Patients{" "}
                </Typography>
              </ListItemButton>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link to="forms" style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton
                style={{ display: "flex", gap: "2rem" }}
                sx={
                  nav.pathname.split("/")[2] === "forms" && {
                    backgroundColor: "whitesmoke",
                  }
                }
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  <FormatAlignCenter />
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Forms
                </Typography>
              </ListItemButton>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Link
              to="orders"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                style={{ display: "flex", gap: "2rem" }}
                sx={
                  nav.pathname.split("/")[2] === "orders" && {
                    backgroundColor: "whitesmoke",
                  }
                }
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  <ListAltRounded />
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Orders
                </Typography>
              </ListItemButton>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Link
              to="appointments"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                style={{ display: "flex", gap: "2rem" }}
                sx={
                  nav.pathname.split("/")[2] === "appointments" && {
                    backgroundColor: "whitesmoke",
                  }
                }
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  <Create />
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Appointments
                </Typography>
              </ListItemButton>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Link
              to="prescriptions"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                style={{ display: "flex", gap: "2rem" }}
                sx={
                  nav.pathname.split("/")[2] === "prescriptions" && {
                    backgroundColor: "whitesmoke",
                  }
                }
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  <Notes />
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Prescriptions
                </Typography>
              </ListItemButton>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <ListItemButton
              style={{ display: "flex", gap: "2rem" }}
              onClick={logoutHandler}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                <Logout />
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Logout
              </Typography>
            </ListItemButton>
          </motion.div>
        </List>
        {/* </motion.div> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Grid2
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundColor: indigo[300],
            color: "white",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ alignSelf: "center" }}
          >
            Hospital Management System
          </Typography>
          <Tooltip title="Change profile picture">
            <IconButton onClick={handleClick}>
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                alt="Remy Sharp"
                src={profilePicture}
              >
                B
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClosePrompt}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                setShowPrompt(true);
                handleClosePrompt();
              }}
            >
              Change Profile Picture
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClosePrompt();
                navigate("/users/profile");
              }}
            >
              View Profile
            </MenuItem>
          </Menu>
        </Grid2>
        <Box sx={{ p: 3, marginTop: "0.5rem", overflow: "hidden" }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.4,
                duration: 0.4,
                ease: "easeInOut",
              },
            }}
          >
            <Outlet />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
