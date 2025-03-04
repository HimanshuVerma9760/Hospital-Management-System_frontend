import React from "react";
import Portal from "./Portal";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const Conn = import.meta.env.VITE_CONN_URI;

const ModalContent = ({ isOpen, onClose, message, btn, type }) => {
  if (!isOpen) return null;

  async function deleteHandler() {
    const response = await fetch(`${Conn}/doctors/soft/${message.id}}`, {
      method: "delete",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      const result = await response.json();
    }
    onClose();
  }
  async function deleteHospitalHandler() {
    const response = await fetch(
      `${Conn}/hospitals/delete/soft/${message.id}}`,
      {
        method: "delete",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response) {
      const result = await response.json();
    }
    onClose();
  }
  async function restoreHandler() {
    const response = await fetch(`${Conn}/doctors/restore/${message.id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      const result = await response.json();
    }
    onClose();
  }
  async function restoreHospitalHandler() {
    const response = await fetch(`${Conn}/hospitals/restore/${message.id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      const result = await response.json();
    }
    onClose();
  }

  function clickHandler() {
    switch (type) {
      case "delete":
        deleteHandler();
        break;
      case "deleteHospital":
        deleteHospitalHandler();
        break;
      case "restore":
        restoreHandler();
        break;
      case "restoreHospital":
        restoreHospitalHandler();
        break;
    }
  }
  return (
    <Portal onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>
          {message.message}
        </Typography>
        <Typography variant="caption" color="red">
          {message.caption}
        </Typography>
        {!type ? (
          <Button>
            <Link to={btn.loc} style={{ textDecoration: "none" }}>
              {btn.text}
            </Link>
          </Button>
        ) : type === "info" ? (
          <Button onClick={() => onClose()}>Close</Button>
        ) : (
          <Grid2
            display="flex"
            gap="1rem"
            justifyContent="center"
            sx={{ padding: "2rem" }}
          >
            <Button variant="contained" onClick={clickHandler}>
              {btn}
            </Button>
            <Button variant="outlined" onClick={() => onClose()}>
              Cancel
            </Button>
          </Grid2>
        )}
      </Box>
    </Portal>
  );
};

export default ModalContent;
