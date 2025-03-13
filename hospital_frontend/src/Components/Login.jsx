import {
  Alert,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Grid2,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import { motion } from "motion/react";
import useAuth from "../util/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const [error, setError] = useState({
    emailError: { state: false, message: "" },
    passwordError: { state: false, message: "" },
  });

  useEffect(() => {
    async function checkAuth() {
      const verifiedUser = await useAuth();
      if (verifiedUser.response) {
        navigate("/users/doctors");
      } else {
        localStorage.clear();
      }
      setPageLoading(false);
    }
    checkAuth();
  }, []);
  async function onSubmitHandler(event) {
    event.preventDefault();
    if (password.trim().length === 0) {
      setError((prevState) => ({
        ...prevState,
        passwordError: {
          state: true,
          message: "Invalid entry",
        },
      }));
      return;
    }
    setIsLoading(true);
    const formData = {
      email,
      password,
    };
    try {
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
        navigate("/users/doctors");
      } else {
        notify("Invalid Credentials!");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error: ", error);
      notify("Server is down, try again later!");
      setIsLoading(false);
    }
  }
  const notify = (response) => {
    toast.error(response);
  };
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

  if (pageLoading) {
    return (
      <Grid2
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton variant="rectangular" width={300} height={300} />
        <Skeleton variant="rectangular" width={300} height={300} />
      </Grid2>
    );
  }
  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition="1s"
      >
        <CssBaseline />
        <Box sx={{ marginTop: "3rem" }}>
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
                minHeight: "30rem",
                borderRadius: "2rem",
                boxShadow: "0px 1px 2px 0px cyan",
              }}
            >
              <Grid2>
                <Typography variant="h3" color="black" align="center">
                  Login
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1.5rem",
                  }}
                  color="red"
                >
                  {isLoading && <CircularProgress />}
                </Typography>
              </Grid2>
              <Grid2
                alignSelf="center"
                sx={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
              >
                <TextField
                  id="email"
                  type="text"
                  name="email"
                  label="Enter email"
                  autoFocus={true}
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
                  }}
                />
                <Typography variant=""></Typography>
                <TextField
                  id="password"
                  type={passwordIsVisible ? "text" : "password"}
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
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setPasswordIsVisible((prevState) => !prevState)
                            }
                          >
                            {passwordIsVisible ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
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
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "0.6rem",
                    marginTop: "1rem",
                  }}
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
