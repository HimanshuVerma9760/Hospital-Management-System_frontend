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
  ImageListItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {
  Create,
  FormatAlignCenter,
  ListAltOutlined,
  ListAltRounded,
  LocalHospital,
  Logout,
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
  useEffect(() => {
    async function checkAuth() {
      const userVerified = await useAuth();
      if (userVerified.response) {
        setIsVerified(true);
        getUser(userVerified.id);
        setIsLoading(false);
      } else {
        setIsVerified(false);
      }
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
          You Are Not Authorised to view this page. Kindly{" "}
          <Link to="/">Login</Link>
        </Alert>
      </Box>
    );
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
            gap: "0.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.5, delay: 0.2 }}
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
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
            transition={{ duration: 0.5, delay: 0.4 }}
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
            transition={{ duration: 0.5, delay: 0.5 }}
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
            transition={{ duration: 0.5, delay: 0.6 }}
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
            transition={{ duration: 0.5, delay: 0.7 }}
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
            <IconButton onClick={() => setShowPrompt(true)}>
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                alt="Remy Sharp"
                src={profilePicture}
              >
                B
              </Avatar>
            </IconButton>
          </Tooltip>
        </Grid2>
        <Box sx={{ p: 3, marginTop: "0.5rem", overflow: "hidden" }}>
          {/* <AnimatePresence mode="wait"> */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                duration: 0.4,
                ease: "easeInOut",
              },
            }}
            // exit={{
            //   opacity: 0,
            //   x: 100,
            //   transition: {
            //     duration: 0.3,
            //     delay: 0,
            //     ease: "easeIn",
            //     damping: 20,
            //   },
            // }}
          >
            <Outlet />
          </motion.div>
          {/* </AnimatePresence> */}
        </Box>
      </Box>
    </Box>
  );
}

// import { AnimatePresence } from "motion/react"
// import * as motion from "motion/react-client"
// import { useState } from "react"

// export default function ExitAnimation() {
//     const [isVisible, setIsVisible] = useState(true)

//     return (
//         <div style={container}>
//             <AnimatePresence initial={false}>
//                 {isVisible ? (
//                     <motion.div
// initial={{ opacity: 0, scale: 0 }}
// animate={{ opacity: 1, scale: 1 }}
// exit={{ opacity: 0, scale: 0 }}
//                         style={box}
//                         key="box"
//                     />
//                 ) : null}
//             </AnimatePresence>
//             <motion.button
//                 style={button}
//                 onClick={() => setIsVisible(!isVisible)}
//                 whileTap={{ y: 1 }}
//             >
//                 {isVisible ? "Hide" : "Show"}
//             </motion.button>
//         </div>
//     )
// }

// /**
//  * ==============   Styles   ================
//  */

// const container: React.CSSProperties = {
//     display: "flex",
//     flexDirection: "column",
//     width: 100,
//     height: 160,
//     position: "relative",
// }

// const box: React.CSSProperties = {
//     width: 100,
//     height: 100,
//     backgroundColor: "#0cdcf7",
//     borderRadius: "10px",
// }

// const button: React.CSSProperties = {
//     backgroundColor: "#0cdcf7",
//     borderRadius: "10px",
//     padding: "10px 20px",
//     color: "#0f1115",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
// }
