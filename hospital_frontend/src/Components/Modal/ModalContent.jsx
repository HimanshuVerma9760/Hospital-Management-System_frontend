import React from "react";
import Portal from "./Portal";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const Conn = import.meta.env.VITE_CONN_URI;

const ModalContent = ({ isOpen, onClose, message, btn, type }) => {
  if (!isOpen) return null;

  async function deletHandler() {
    const response = await fetch(
      `${Conn}/doctors/${message.id}/soft/${localStorage.getItem("token")}`,
      {
        method: "delete",
      }
    );
    if (response) {
      const result = await response.json();
      console.log(result.message);
    }
    onClose();
  }
  async function restoreHandler() {
    const response = await fetch(
      `${Conn}/doctors/restore/${message.id}/${localStorage.getItem("token")}`
    );
    if (response) {
      const result = await response.json();
      console.log(result.message);
    }
    onClose();
  }

  function clickHandler() {
    switch (type) {
      case "delete":
        deletHandler();
        break;
      case "restore":
        restoreHandler();
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
        ) : (
          <>
            <Button onClick={clickHandler}>{btn}</Button>
          </>
        )}
      </Box>
    </Portal>
  );
};

export default ModalContent;
