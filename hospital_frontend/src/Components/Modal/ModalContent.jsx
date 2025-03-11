import React, { useEffect, useRef, useState } from "react";
import Portal from "./Portal";
import { Box, Button, Grid2, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const Conn = import.meta.env.VITE_CONN_URI;

const ModalContent = ({ isOpen, onClose, message, btn, type, metaData }) => {
  if (!isOpen) return null;

  const [formTitle, setFormTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({
    titleError: {
      state: false,
      message: "",
    },
    descriptionError: {
      state: false,
      message: "",
    },
  });

  async function fetchFormData() {
    try {
      const response = await fetch(`${Conn}/form/get/${metaData.id}`);
      if (response.ok) {
        const result = await response.json();
        setFormTitle(result.result.title);
        setDescription(result.result.description);
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (type === "editForm") {
      fetchFormData();
    }
  }, [type]);
  const navigate = useNavigate();

  function onChangeHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;

    switch (id) {
      case "title":
        setFormTitle(value);
        if (error.titleError.state) {
          setError((prevState) => ({
            ...prevState,
            titleError: {
              state: false,
              message: "",
            },
          }));
        }
        break;
      case "description":
        setDescription(value);
        if (error.descriptionError.state) {
          setError((prevState) => ({
            ...prevState,
            descriptionError: {
              state: false,
              message: "",
            },
          }));
        }
        break;
      default:
        break;
    }
  }
  function blurHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;

    switch (id) {
      case "title":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            titleError: {
              state: true,
              message: "Invalid Title",
            },
          }));
        }
        break;
      case "description":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            descriptionError: {
              state: true,
              message: "Invalid Description",
            },
          }));
        }
        break;
      default:
        break;
    }
  }

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
  // const funcType=useRef();

  async function editFormHandler() {
    const editFormData = {
      title: formTitle,
      description,
    };
    const response = await fetch(`${Conn}/form/edit/${metaData.id}`, {
      method: "post",
      body: JSON.stringify(editFormData),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      onClose();
    }
  }
  async function verifyForm() {
    if (description.trim().length === 0) {
      setError((prevState) => ({
        ...prevState,
        descriptionError: {
          state: true,
          message: "Cannot be empty",
        },
      }));
      return;
    }
    const response = await fetch(
      `${Conn}/form/verify/${
        type === "editForm" ? metaData.id : 0
      }/?form=${formTitle}&type=${type}`
    );
    if (response.ok) {
      if (type === "editForm") {
        return editFormHandler();
      }
      navigate("create");
    } else {
      setError((prevState) => ({
        ...prevState,
        titleError: {
          state: true,
          message: "The form already exist",
        },
      }));
    }
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
      case "form":
        localStorage.setItem("title", formTitle);
        localStorage.setItem("description", description);
        verifyForm();
        break;
      case "editForm":
        verifyForm();
        break;
      default:
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
        <Typography
          variant="caption"
          color={!type ? "red" : "blue"}
          sx={{ marginBottom: "2rem" }}
        >
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
        ) : type === "form" || type === "editForm" ? (
          <Grid2 sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Grid2>
              <TextField
                label={error.titleError.message || "Form Title"}
                autoFocus={true}
                id="title"
                name="title"
                sx={{ width: "12.8rem" }}
                error={error.titleError.state}
                value={formTitle}
                onChange={onChangeHandler}
                onBlur={blurHandler}
              />
            </Grid2>
            <Grid2>
              <TextField
                label={error.descriptionError.message || "Description"}
                id="description"
                name="description"
                rows={3}
                multiline
                error={error.descriptionError.state}
                onBlur={blurHandler}
                value={description}
                onChange={onChangeHandler}
              />
            </Grid2>
            <Grid2
              sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <Button
                disabled={
                  error.titleError.state || error.descriptionError.state
                }
                variant="contained"
                size="small"
                onClick={clickHandler}
              >
                {type === "form" ? "Create" : "Submit"}
              </Button>
              <Button variant="outlined" size="small" onClick={onClose}>
                Cancel
              </Button>
            </Grid2>
          </Grid2>
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
