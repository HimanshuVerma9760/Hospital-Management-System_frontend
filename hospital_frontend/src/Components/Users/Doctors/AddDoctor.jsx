import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import useAuth from "../../../util/useAuth";
import toast, { Toaster } from "react-hot-toast";
const Conn = import.meta.env.VITE_CONN_URI;

export default function AddDoctor() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [fees, setFees] = useState("");
  const [hospital, setHospital] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();
  async function fetchCities() {
    const response = await fetch(`${Conn}/cities`);
    if (response.ok) {
      const result = await response.json();
      setCities(result.result);
    } else {
      console.log("Some error occured");
    }
  }
  async function fetchHospitals() {
    const response = await fetch(`${Conn}/hospitals/get-all`);
    if (response.ok) {
      const result = await response.json();
      setHospitals(result.result);
    } else {
      console.log("Some error occured");
    }
  }
  async function fetchSpecializations() {
    const response = await fetch(`${Conn}/specializations`);
    if (response.ok) {
      const result = await response.json();
      setSpecializations(result.result);
    } else {
      console.log("Some error occured");
    }
  }
  useEffect(() => {
    async function checkAuth() {
      const verifiedUser = await useAuth();
      if (!(verifiedUser.response && verifiedUser.role === "Super-Admin")) {
        setIsVerified(false);
      } else {
        setIsLoading(false);
        fetchCities();
        fetchHospitals();
        fetchSpecializations();
      }
    }
    checkAuth();
  }, []);

  function onChangeHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;
    switch (id) {
      case "name":
        setName(value);
        setError((prevState) => ({
          ...prevState,
          nameError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "specialization":
        setSpecialization(value);
        setError((prevState) => ({
          ...prevState,
          specializationError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "city":
        setCity(value);
        setError((prevState) => ({
          ...prevState,
          cityError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "email":
        setEmail(value);
        setError((prevState) => ({
          ...prevState,
          emailError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "password":
        setPassword(value);
        setError((prevState) => ({
          ...prevState,
          passwordError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "fees":
        setFees(value);
        setError((prevState) => ({
          ...prevState,
          feesError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "hospital":
        setHospital(value);
        setError((prevState) => ({
          ...prevState,
          hospitalError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        setError((prevState) => ({
          ...prevState,
          confirmPasswordError: {
            state: false,
            message: "",
          },
        }));
        break;
      default:
        break;
    }
  }

  function containsNumber(name) {
    return /\d/.test(name);
  }
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    hospitalError: {
      state: false,
      message: "",
    },
    cityError: {
      state: false,
      message: "",
    },
    specializationError: {
      state: false,
      message: "",
    },
    feesError: {
      state: false,
      message: "",
    },
    emailError: {
      state: false,
      message: "",
    },
    passwordError: {
      state: false,
      message: "",
    },
    confirmPasswordError: {
      state: false,
      message: "",
    },
  });
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function onBlurHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;
    switch (id) {
      case "name":
        if (containsNumber(value) || value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            nameError: {
              state: true,
              message: "Invalid Name",
            },
          }));
        }
        break;

      case "specialization":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            specializationError: {
              state: true,
              message: "Invalid specialization",
            },
          }));
        }
        break;

      case "city":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            cityError: {
              state: true,
              message: "Choose a city from the menu",
            },
          }));
        }
        break;
      case "email":
        if (!isValidEmail(value)) {
          setError((prevState) => ({
            ...prevState,
            emailError: {
              state: true,
              message: "Invalid email provided",
            },
          }));
        }
        break;
      case "password":
        if (value.trim().length < 8) {
          setError((prevState) => ({
            ...prevState,
            passwordError: {
              state: true,
              message: "Password length must be atleast 8",
            },
          }));
        }
        break;

      case "hospital":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            hospitalError: {
              state: true,
              message: "Choose a hospital from the menu",
            },
          }));
        }
        break;
      case "hospital":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            hospitalError: {
              state: true,
              message: "Choose a hospital from the menu",
            },
          }));
        }
        break;
      case "confirmPassword":
        if (value.length < 8) {
          setError((prevState) => ({
            ...prevState,
            confirmPasswordError: {
              state: true,
              message: "Password length must be atleast 8",
            },
          }));
        } else if (value !== password) {
          setError((prevState) => ({
            ...prevState,
            confirmPasswordError: {
              state: true,
              message: "Passwords are different",
            },
          }));
        }
        break;
      case "fees":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            feesError: {
              state: true,
              message: "Invalid Value",
            },
          }));
        } else if (value > 1500) {
          setError((prevState) => ({
            ...prevState,
            feesError: {
              state: true,
              message: "Fees must be less then 1500",
            },
          }));
        } else if (value < 500) {
          setError((prevState) => ({
            ...prevState,
            feesError: {
              state: true,
              message: "Fees must be atleast 500",
            },
          }));
        }
        break;
      default:
        break;
    }
  }
  async function onSubmitHandler(event) {
    event.preventDefault();
    setSubmissionProgress(true);
    const formData = {
      name: name,
      email: email,
      password: password,
      specialization_id: specialization,
      city_id: city,
      hospital_id: hospital,
      fees: Number(fees),
    };

    try {
      const response = await fetch(`${Conn}/doctors/add`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (response) {
        const result = await response.json();
        setSubmissionProgress(false);
        if (response.ok) {
          notify("success");
          setName("");
          setSpecialization("");
          setCity("");
          setHospital("");
          setFees("");
        } else {
          if (response.status === "400") {
            notify(result.message[0]);
          } else {
            notify(result.message);
          }
        }
      }
    } catch (error) {
      console.log("error: ", error);
      notify("Server is down, try again later");
      setSubmissionProgress(false);
    }
  }
  const notify = (response) => {
    response === "success"
      ? toast.success("Successfully added doctor")
      : toast.error(response);
  };
  if (isLoading) {
    return <LinearProgress />;
  } else if (!isVerified) {
    navigate("/users/dashboard");
  }
  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          maxWidth: "60%",
          margin: "auto",
          boxShadow: "0px 1px 2px 0px cyan",
          borderRadius: "1rem",
        }}
      >
        <Toaster />
        <Grid2 sx={{ paddingTop: "1rem" }}>
          <Typography variant="h5" sx={{ fontSize: "1.5rem" }} align="center">
            Add Doctor
          </Typography>
          <Typography
            variant="caption"
            align="center"
            display="flex"
            justifyContent="center"
            color="red"
          >
            {submissionProgress && (
              <Grid2 display="flex" justifyContent="center">
                <CircularProgress />
              </Grid2>
            )}
          </Typography>
        </Grid2>
        <Form onSubmit={onSubmitHandler}>
          <Grid2
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "0.5rem",
              paddingLeft: "5rem",
              paddingRight: "5rem",
              paddingBottom: "1.5rem",
              paddingTop: "1rem",
            }}
          >
            <TextField
              name="name"
              id="name"
              label="Enter name of the Doctor"
              value={name}
              onBlur={onBlurHandler}
              error={error.nameError.state}
              helperText={error.nameError.message}
              onChange={onChangeHandler}
              size="medium"
            />
            <TextField
              name="email"
              id="email"
              label="Enter email of the Doctor"
              value={email}
              onBlur={onBlurHandler}
              error={error.emailError.state}
              helperText={error.emailError.message}
              onChange={onChangeHandler}
              size="medium"
            />
            <TextField
              name="password"
              id="password"
              type="password"
              label="Enter password"
              value={password}
              onBlur={onBlurHandler}
              error={error.passwordError.state}
              helperText={error.passwordError.message}
              onChange={onChangeHandler}
              size="medium"
            />
            <TextField
              name="confirmPassword"
              id="confirmPassword"
              type="text"
              label="Repeat password"
              value={confirmPassword}
              onBlur={onBlurHandler}
              error={error.confirmPasswordError.state}
              helperText={error.confirmPasswordError.message}
              onChange={onChangeHandler}
              size="medium"
            />
            <TextField
              name="fees"
              id="fees"
              label="Enter fees of the Doctor"
              type="number"
              value={fees}
              onBlur={onBlurHandler}
              error={error.feesError.state}
              helperText={error.feesError.message}
              onChange={onChangeHandler}
              size="medium"
            />
            <FormControl error={error.specializationError.state}>
              <InputLabel id="specializationLabel">Specialization</InputLabel>
              <Select
                labelId="specializationLabel"
                id="specialization"
                name="specialization"
                label="Specialization"
                value={specialization}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                size="medium"
              >
                {isLoading ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  specializations.map((eachSpecialization) => (
                    <MenuItem
                      id={eachSpecialization.id}
                      value={eachSpecialization.id}
                      key={eachSpecialization.id}
                    >
                      {eachSpecialization.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>
                {error.specializationError.message}
              </FormHelperText>
            </FormControl>
            <FormControl error={error.cityError.state}>
              <InputLabel id="cityLabel">City</InputLabel>
              <Select
                labelId="cityLabel"
                id="city"
                name="city"
                label="City"
                value={city}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                size="medium"
              >
                {isLoading ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  cities.map((eachCity) => (
                    <MenuItem
                      id={eachCity.id}
                      value={eachCity.id}
                      key={eachCity.id}
                    >
                      {eachCity.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>{error.cityError.message}</FormHelperText>
            </FormControl>
            <FormControl error={error.hospitalError.state}>
              <InputLabel id="hospitalLabel">Hospital</InputLabel>
              <Select
                labelId="hospitalLabel"
                id="hospital"
                name="hospital"
                label="Hospital"
                value={hospital}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                size="medium"
              >
                {isLoading ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  hospitals.map((eachHospital) => (
                    <MenuItem value={eachHospital.id} key={eachHospital.id}>
                      {eachHospital.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>{error.hospitalError.message}</FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "green" }}
              disabled={
                error.nameError.state ||
                error.specializationError.state ||
                error.hospitalError.state ||
                error.cityError.state ||
                error.feesError.state
              }
            >
              Add
            </Button>
          </Grid2>
        </Form>
      </Box>
    </>
  );
}
