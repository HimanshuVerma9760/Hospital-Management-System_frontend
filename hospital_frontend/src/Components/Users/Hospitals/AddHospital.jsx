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
import { addNewHospital, fetchCities } from "../../../util/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
const Conn = import.meta.env.VITE_CONN_URI;

export default function AddHospital() {
  const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const redirect = debounce(() => navigate("/users/hospitals"), 2000);

  const { data: myFetchedCities } = useQuery({
    queryKey: ["fetch-all-cities"],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 5,
  });

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
      case "location":
        setLocation(value);
        setError((prevState) => ({
          ...prevState,
          locationError: {
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
      default:
        break;
    }
  }
  const { mutate } = useMutation({
    mutationFn: addNewHospital,
    onSuccess: () => {
      setSubmissionProgress(false);
      toast.loading(
        "Hospital added successfully, redirecting to hospitals page",
        { duration: 1900 }
      );
      redirect();
    },
  });
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
      location: location,
      city_id: city,
    };
    mutate({ formData });
  }

  function containsNumber(name) {
    return /\d/.test(name);
  }
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    locationError: {
      state: false,
      message: "",
    },
    cityError: {
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

      case "location":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            locationError: {
              state: true,
              message: "Invalid location",
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

      default:
        break;
    }
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
        <Toaster />
        <Grid2 sx={{ marginBottom: "2rem", paddingTop: "3rem" }}>
          <Typography variant="h4" align="center">
            Add Hospital
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
              label="Enter name of the hospital"
              value={name}
              error={error.nameError.state}
              onBlur={onBlurHandler}
              helperText={error.nameError.message}
              onChange={onChangeHandler}
            />
            <TextField
              name="location"
              id="location"
              label="Enter location of the hospital"
              error={error.locationError.state}
              onBlur={onBlurHandler}
              helperText={error.locationError.message}
              value={location}
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
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
              >
                {!myFetchedCities ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  myFetchedCities.map((eachCity) => (
                    <MenuItem value={eachCity.id} key={eachCity.id}>
                      {eachCity.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>{error.cityError.message}</FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "green" }}
              disabled={
                error.nameError.state ||
                error.cityError.state ||
                error.locationError.state
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
