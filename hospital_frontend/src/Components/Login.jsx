import {
  Alert,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { motion } from "motion/react";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [responseError, setResponseError] = useState(false);

  const [error, setError] = useState({
    emailError: { state: false, message: "" },
    passwordError: { state: false, message: "" },
  });
  async function onSubmitHandler(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = {
      email,
      password,
    };
    const response = await fetch(`${Conn}/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      navigate("/users");
    } else {
      setResponseError(true);
    }
    setIsLoading(false);
  }
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  function onBlurHandler(event) {
    const { id, value } = event.target;
    switch (id) {
      case "email":
        if (!isValidEmail(value)) {
          setError((prevState) => ({
            ...prevState,
            emailError: { state: true, message: "Invalid Email" },
          }));
        } else {
          setError((prevState) => ({
            ...prevState,
            emailError: { state: false, message: "" },
          }));
        }
        break;
      case "password":
        if (password.trim().length < 8) {
          setError((prevState) => {
            return {
              ...prevState,
              passwordError: {
                state: true,
                message: "Password must be atleast 8 character long",
              },
            };
          });
        }
        break;
      default:
        break;
    }
  }
  function onChangeHandler(event) {
    const id = event.target.id;
    const value = event.target.value;
    setFormError(false);
    setResponseError(false);
    switch (id) {
      case "email":
        setEmail(value);
        setError((prevState) => {
          return {
            ...prevState,
            emailError: { state: false, message: "" },
          };
        });
        break;
      case "password":
        setPassword(value);
        setError((prevState) => {
          return {
            ...prevState,
            passwordError: {
              state: false,
              message: "",
            },
          };
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition="1s"
      >
        <CssBaseline />
        <Box sx={{ marginTop: "9rem" }}>
          <Form onSubmit={onSubmitHandler}>
            <Grid2
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.5rem",
                maxWidth: "30rem",
                margin: "auto",
                backgroundColor: "white",
                paddingTop: "5rem",
                paddingBottom: "5rem",
                borderRadius: "2rem",
                boxShadow: "0px 1px 2px 0px",
              }}
            >
              <Grid2 alignSelf="center">
                <Typography variant="h3" color="black">
                  Login
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ paddingLeft: "5px" }}
                  color="red"
                >
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    responseError && "Invalid Credentials!"
                  )}
                </Typography>
              </Grid2>
              <Grid2
                alignSelf="center"
                sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <TextField
                  id="email"
                  type="text"
                  name="email"
                  label="Enter email"
                  value={email}
                  onChange={onChangeHandler}
                  error={error.emailError.state}
                  onBlur={onBlurHandler}
                  helperText={
                    error.emailError.state && error.emailError.message
                  }
                  sx={{
                    backgroundColor: "white",
                    minWidth: "25rem",
                    borderRadius: "10px",
                    // color: "black",
                  }}
                />
                <Typography variant=""></Typography>
                <TextField
                  id="password"
                  type="password"
                  name="password"
                  label="Enter password"
                  value={password}
                  onChange={onChangeHandler}
                  onBlur={onBlurHandler}
                  error={error.passwordError.state}
                  helperText={
                    error.passwordError.state && error.passwordError.message
                  }
                  sx={{
                    input: {
                      color: "black",
                    },
                    backgroundColor: "white",
                    minWidth: "25rem",
                    borderRadius: "10px",
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    error.emailError.state ||
                    error.passwordError.state ||
                    formError
                  }
                  color="white"
                >
                  Login
                </Button>
              </Grid2>
            </Grid2>
          </Form>
        </Box>
      </motion.div>
    </>
  );
}
