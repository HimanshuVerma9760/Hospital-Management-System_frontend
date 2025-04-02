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
import useAuth from "../../../util/useAuth";
import ModalContent from "../../Modal/ModalContent";
import { debounce } from "lodash";
import toast, { Toaster } from "react-hot-toast";
import {
  editExistingDoctorDetails,
  fetchCities,
  fetchHospitals,
  fetchSpecializations,
} from "../../../util/http";
import { useMutation, useQuery } from "@tanstack/react-query";
const Conn = import.meta.env.VITE_CONN_URI;

export default function EditDoctor() {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isVerified, setIsVerified] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [fees, setFees] = useState("");
  const [hospital, setHospital] = useState("");
  // const [hospitals, setHospitals] = useState([]);
  // const [message, setMessage] = useState("");
  // const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();

  const reqId = useRef();

  const { data: myFetchedHospitals } = useQuery({
    queryKey: ["fetch-all-hospitals"],
    queryFn: fetchHospitals,
    staleTime: 1000 * 60 * 5,
  });

  const { data: myFetchedSpecializations } = useQuery({
    queryKey: ["fetch-all-specializations"],
    queryFn: fetchSpecializations,
    staleTime: 1000 * 60 * 5,
  });

  const { data: myFetchedCities } = useQuery({
    queryKey: ["fetch-all-cities"],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    async function fetchDoctor() {
      const response = await fetch(`${Conn}/doctors/get/${reqId.current}`);
      if (response.ok) {
        const result = await response.json();
        setName(result.doctor.name);
        setSpecialization(result.doctor.specialization_id);
        setCity(result.doctor.city_id);
        setHospital(result.doctor.hospital_id);
        setFees(result.doctor.fees);
      } else {
        console.log("Some error occured");
      }
    }
    const id = localStorage.getItem("id");
    if (!id) {
      navigate("/users/doctors");
      return;
    }
    reqId.current = localStorage.getItem("id");
    removeId();
    fetchDoctor();
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

      default:
        break;
    }
  }
  const nav = useNavigate();

  const { mutate } = useMutation({
    mutationFn: editExistingDoctorDetails,
    onSuccess: () => {
      setSubmissionProgress(false);
      toast.loading(
        "Doctor Updated Successfully, redirecting to doctors page",
        { duration: 1900 }
      );
      redirect();
    },
  });
  const redirect = debounce(() => {
    nav("/users/doctors");
  }, 2000);
  async function onSubmitHandler(event) {
    event.preventDefault();
    setSubmissionProgress(true);
    const formData = {
      name: name,
      specialization_id: specialization,
      city_id: city,
      hospital_id: hospital,
      fees: Number(fees),
    };
    mutate({ formData, reqID: reqId.current });
  }
  // const notify = (response) => {
  //   toast.error(response);
  // };

  const removeId = debounce(() => {
    localStorage.removeItem("id");
  }, 2000);

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
        <Grid2 sx={{ paddingTop: "1rem" }}>
          <Typography variant="h5" sx={{ fontSize: "1.5rem" }} align="center">
            Edit Doctor
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
                size="medium"
                onBlur={onBlurHandler}
              >
                {!myFetchedSpecializations ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  myFetchedSpecializations.map((eachSpecialization) => (
                    <MenuItem
                      id={eachSpecialization.name}
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
                value={city || ""}
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
            <FormControl error={error.hospitalError.state}>
              <InputLabel id="hospitalLabel">Hospital</InputLabel>
              <Select
                labelId="hospitalLabel"
                id="hospital"
                name="hospital"
                label="Hospital"
                value={hospital}
                onChange={onChangeHandler}
                size="medium"
                onBlur={onBlurHandler}
              >
                {!myFetchedHospitals ? (
                  <Grid2 display="flex" justifyContent="center">
                    <CircularProgress />
                  </Grid2>
                ) : (
                  myFetchedHospitals.map((eachHospital) => (
                    <MenuItem
                      id={eachHospital.id}
                      value={eachHospital.id}
                      key={eachHospital.id}
                    >
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
