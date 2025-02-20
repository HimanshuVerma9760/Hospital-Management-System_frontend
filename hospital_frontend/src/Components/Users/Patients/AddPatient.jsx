import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Form } from "react-router";
import useAuth from "../../../util/useAuth";
const Conn = import.meta.env.VITE_CONN_URI;

export default function AddPatient() {
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState(false);
  const [name, setName] = useState("");
  const [disease, setDisease] = useState("");
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [message, setMessage] = useState("");
  async function fetchCities() {
    const response = await fetch(`${Conn}/cities`);
    if (response.ok) {
      const result = await response.json();
      setCities(result.result);
    } else {
      console.log("Some error occured");
    }
  }
  async function fetchDoctors() {
    const response = await fetch(`${Conn}/doctors/get-all`);
    if (response.ok) {
      const result = await response.json();
      setDoctors(result.result);
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
  function containsNumber(name) {
    return /\d/.test(name);
  }
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    diseaseError: {
      state: false,
      message: "",
    },
    cityError: {
      state: false,
      message: "",
    },
    hospitalError: {
      state: false,
      message: "",
    },
    doctorError: {
      state: false,
      message: "",
    },
  });
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

      case "disease":
        if (containsNumber(value) || value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            diseaseError: {
              state: true,
              message: "Invalid disease",
            },
          }));
        }
        break;

      case "city":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            cityError: {
              state: true,
              message: "Choose a city from the menu",
            },
          }));
        }
        break;

      case "hospital":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            hospitalError: {
              state: true,
              message: "Choose a hospital from the menu",
            },
          }));
        }
        break;
      case "doctor":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            doctorError: {
              state: true,
              message: "Choose a doctor from the menu",
            },
          }));
        }
        break;

      default:
        break;
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
        fetchDoctors();
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
      case "disease":
        setDisease(value);
        setError((prevState) => ({
          ...prevState,
          diseaseError: {
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
      case "doctor":
        setDoctor(value);
        setError((prevState) => ({
          ...prevState,
          doctorError: {
            state: false,
            message: "",
          },
        }));
        break;
      default:
        break;
    }
  }
  async function onSubmitHandler(event) {
    event.preventDefault();
    setSubmissionProgress(true);
    const verifiedUser = await useAuth();
    if (!(verifiedUser.response && verifiedUser.role === "Super-Admin")) {
      setIsVerified(false);
      return;
    }
    const formData = {
      name: name,
      disease: disease,
      city_id: city,
      hospital_id: hospital,
      doctor_id: doctor,
    };

    const response = await fetch(`${Conn}/patients/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response) {
      const result = await response.json();
      setSubmissionProgress(false);
      if (response.ok) {
        setMessage(result.message);
        setDisease("");
        setCity("");
        setDoctor("");
        setHospital("");
      } else {
        setMessage(result.message[0]);
      }
    }
  }

  if (isLoading) {
    return (
      <Grid2
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Skeleton variant="text" width={300} sx={{ alignSelf: "center" }} />
        <Skeleton
          variant="rectangular"
          width={300}
          height={200}
          sx={{ alignSelf: "center" }}
        />
        <Skeleton
          variant="rectangular"
          width={300}
          height={200}
          sx={{ alignSelf: "center" }}
        />
      </Grid2>
    );
  } else if (!isVerified) {
    return (
      <Alert severity="error">
        You are not authorized to perform this action
      </Alert>
    );
  }
  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          maxWidth: "60%",
          margin: "auto",
          boxShadow: "0px 1px 1px 0px",
          borderRadius: "1rem",
        }}
      >
        <Grid2 sx={{ marginBottom: "2rem", paddingTop: "3rem" }}>
          <Typography variant="h4" align="center">
            Add Patient
          </Typography>
          <Typography
            variant="caption"
            align="center"
            display="flex"
            justifyContent="center"
            color="red"
          >
            {submissionProgress ? (
              <Grid2 display="flex" justifyContent="center">
                <CircularProgress />
              </Grid2>
            ) : (
              message
            )}
          </Typography>
        </Grid2>
        <Form onSubmit={onSubmitHandler}>
          <Grid2
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1rem",
              paddingLeft: "5rem",
              paddingRight: "5rem",
              paddingBottom: "3rem",
            }}
          >
            <TextField
              name="name"
              id="name"
              label="Enter name of the Patient"
              value={name}
              onBlur={onBlurHandler}
              error={error.nameError.state}
              helperText={error.nameError.message}
              onChange={onChangeHandler}
            />
            <TextField
              name="disease"
              id="disease"
              label="Enter disease name"
              value={disease}
              onBlur={onBlurHandler}
              error={error.diseaseError.state}
              helperText={error.diseaseError.message}
              onChange={onChangeHandler}
            />
            <FormControl error={error.cityError.state}>
              <InputLabel id="cityLabel">City</InputLabel>
              <Select
                labelId="cityLabel"
                id="city"
                name="city"
                label="City"
                value={city}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
              >
                {isLoading ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  cities.map((eachCity) => (
                    <MenuItem value={eachCity.id} key={eachCity.id}>
                      {eachCity.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>{error.cityError.message}</FormHelperText>
            </FormControl>
            <FormControl error={error.hospitalError.state}>
              <InputLabel id="hospitalLabel">Hospitals</InputLabel>
              <Select
                labelId="hospitalLabel"
                id="hospital"
                name="hospital"
                label="Hospital"
                value={hospital}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
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
            <FormControl error={error.doctorError.state}>
              <InputLabel id="doctorLabel">Doctor</InputLabel>
              <Select
                labelId="doctorLabel"
                id="doctor"
                name="doctor"
                label="Doctor"
                value={doctor}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
              >
                {isLoading ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  doctors.map((eachDoctor) => (
                    <MenuItem value={eachDoctor.id} key={eachDoctor.id}>
                      {eachDoctor.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>{error.doctorError.message}</FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "green" }}
              disabled={
                error.cityError.state ||
                error.hospitalError.state ||
                error.doctorError.state ||
                error.nameError.state
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
