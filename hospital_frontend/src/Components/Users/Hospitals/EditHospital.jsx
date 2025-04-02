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
import { useEffect, useRef, useState } from "react";
import { Form, useLocation, useNavigate } from "react-router";
// import useAuth from "../../../util/useAuth";
import { indigo } from "@mui/material/colors";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editHospital, fetchCities } from "../../../util/http";
import { debounce } from "lodash";
const Conn = import.meta.env.VITE_CONN_URI;

export default function EditHospital() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const redirect = debounce(() => nav("/users/hospitals"), 2000);
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    cityError: {
      state: false,
      message: "",
    },
    locationError: {
      state: false,
      message: "",
    },
  });
  const navigate = useNavigate();
  const reqId = useRef();

  useEffect(() => {
    async function fetchHospital() {
      const response = await fetch(`${Conn}/hospitals/${reqId.current}`);
      if (response.ok) {
        const result = await response.json();
        setIsLoading(false);
        setName(result.hospital.name);
        setCity(Number(result.hospital.city_id));
        setLocation(result.hospital.location);
      } else {
        setIsLoading(false);
        toast.error("Some error occured");
        console.log("Some error occured");
      }
    }
    const id = localStorage.getItem("id");
    if (!id) {
      navigate("users/hospitals");
      return;
    }
    reqId.current = localStorage.getItem("id");
    fetchHospital();
  }, []);

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
      default:
        break;
    }
  }
  function containsNumber(name) {
    return /\d/.test(name);
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
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: editHospital,
    onSuccess: () => {
      toast.loading(
        "Hospital edited successfully, redirecting to hospitals page",
        { duration: 1900 }
      );
      redirect();
    },
  });

  async function onSubmitHandler(event) {
    event.preventDefault();
    setSubmissionProgress(true);
    const formData = {
      name: name,
      location: location,
      city_id: city,
    };
    mutate({ formData, reqId: reqId.current });
  }

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={460}
        sx={{ borderRadius: "10px" }}
      />
    );
  }
  localStorage.removeItem("id");
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
        <Grid2
          sx={{
            paddingTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <Typography variant="h5" sx={{ fontSize: "1.5rem" }} align="center">
            Edit Hospital
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
              name="location"
              id="location"
              label="Enter location of the Doctor"
              value={location}
              onBlur={onBlurHandler}
              error={error.locationError.state}
              helperText={error.locationError.message}
              onChange={onChangeHandler}
              size="medium"
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
                size="medium"
                onBlur={onBlurHandler}
              >
                {!myFetchedCities ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  myFetchedCities.map((eachCity) => (
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
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: indigo[300] }}
              disabled={
                error.nameError.state ||
                error.locationError.state ||
                error.cityError.state
              }
            >
              Submit
            </Button>
          </Grid2>
        </Form>
      </Box>
    </>
  );
}
