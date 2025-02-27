import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router";
import CheckoutPage from "./CheckoutPage";
const Conn = import.meta.env.VITE_CONN_URI;

export default function CreateAppointments() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disease, setDisease] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [hospital, setHospital] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [fees, setFees] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isCardMode, setIsCardMode] = useState(false);
  //   const navigate = useNavigate();
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    emailError: {
      state: false,
      message: "",
    },
    dateError: {
      state: false,
      message: "",
    },
    timeError: {
      state: false,
      message: "",
    },
    hospitalError: {
      state: false,
      message: "",
    },
    diseaseError: {
      state: false,
      message: "",
    },
    doctorError: {
      state: false,
      message: "",
    },
    paymentMethodError: {
      state: false,
      message: "",
    },
  });
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  function onBlurHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;

    switch (id) {
      case "name":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            nameError: {
              state: true,
              message: "Invalid name",
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
              message: "Invalid email",
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
              message: "Choose valid value from the menu",
            },
          }));
        }
        break;
      case "disease":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            diseaseError: {
              state: true,
              message: "Choose valid value from the menu",
            },
          }));
        }
        break;
      case "doctor":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            doctorError: {
              state: true,
              message: "Choose valid value from the menu",
            },
          }));
        }
        break;
      case "date":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            dateError: {
              state: true,
              message: "Choose valid value from the menu",
            },
          }));
        } else if (hasDatePassed(value)) {
          setError((prevState) => ({
            ...prevState,
            dateError: {
              state: true,
              message: "Selected date has already passed!",
            },
          }));
        }
        break;
      case "time":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            timeError: {
              state: true,
              message: "Choose valid value from the menu",
            },
          }));
        }
        break;
      case "paymentMethod":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            paymentMethodError: {
              state: true,
              message: "Choose valid value from the menu",
            },
          }));
        }
        break;
      default:
        break;
    }
  }
  function hasDatePassed(selectedDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    return selected < today;
  }
  async function fetchDiseases() {
    const response = await fetch(`${Conn}/diseases`);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      setDiseases(result.result);
      setIsLoading(false);
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
  async function fetchDoctors(hospitalId) {
    const response = await fetch(
      `${Conn}/doctors/appointment/get-all/?hospitalId=${hospitalId}`
    );
    if (response.ok) {
      const result = await response.json();
      setDoctors(result.result);
    } else {
      console.log("Some error occured");
    }
  }
  useEffect(() => {
    fetchDiseases();
    fetchHospitals();
  }, []);

  const order = useRef();
  const appointment = useRef();
  async function appointmentHandler() {
    const formData = {
      patientName: name,
      patientEmail: email,
      disease_id: disease,
      hospital_id: hospital,
      doctor_id: doctor,
      appointment_date: date,
      appointment_time: time,
      fees: fees,
      paymentMethod: paymentMethod,
    };
    const response = await fetch(`${Conn}/appointments/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response) {
      const result = await response.json();
      setMessage(result.message);
      if (response.ok) {
        if (paymentMethod !== "Cash") {
          setIsCardMode(true);
          order.current = result.order;
          appointment.current = result.appointment;
          //   navigate("checkout");
        } else {
          setName("");
          setDisease("");
          setEmail("");
          setDoctor("");
          setHospital("");
          setDate("");
          setTime("");
          setPaymentMethod("");
          setFees("");
        }
      }
    } else {
      setMessage("Server is down, please try again later!");
    }
  }

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
      case "hospital":
        setHospital(value);
        fetchDoctors(value);
        setIsDisabled(false);
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
        setFees(
          doctors.filter((eachDoctor) => eachDoctor.id === value)[0].fees
        );
        setError((prevState) => ({
          ...prevState,
          doctorError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "date":
        setDate(value);
        setError((prevState) => ({
          ...prevState,
          dateError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "time":
        setTime(value);
        setError((prevState) => ({
          ...prevState,
          timeError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "paymentMethod":
        setPaymentMethod(value);
        setError((prevState) => ({
          ...prevState,
          paymentMethodError: {
            state: false,
            message: "",
          },
        }));
      default:
        break;
    }
  }
  if (isCardMode) {
    return (
      <CheckoutPage order={order.current} appointment={appointment.current} />
    );
  }
  return (
    <Box>
      <Form>
        <Grid2
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            maxWidth: "60%",
            margin: "auto",
            backgroundColor: "white",
            padding: "3rem",
            borderRadius: "1rem",
            boxShadow: "0px 1px 2px 1px cyan",
          }}
        >
          <Typography variant="h4" align="center" sx={{ marginBottom: "1rem" }}>
            Create Appointments
          </Typography>
          {message}
          <TextField
            label="Enter name"
            value={name}
            id="name"
            error={error.nameError.state}
            helperText={error.nameError.message}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
          />
          <TextField
            label="Enter email"
            value={email}
            id="email"
            error={error.emailError.state}
            helperText={error.emailError.message}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
          />
          <FormControl error={error.diseaseError.state}>
            <InputLabel id="diseaseLabel">Disease</InputLabel>
            <Select
              labelId="diseaseLabel"
              id="disease"
              name="disease"
              label="disease"
              value={disease}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
            >
              {isLoading ? (
                <Grid2 display="flex" justifyContent="center">
                  <CircularProgress />
                </Grid2>
              ) : (
                diseases.map((eachDisease) => (
                  <MenuItem value={eachDisease.id} key={eachDisease.id}>
                    {eachDisease.name}
                  </MenuItem>
                ))
              )}
            </Select>
            <FormHelperText>{error.diseaseError.message}</FormHelperText>
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
              disabled={isDisabled}
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
            <FormHelperText>
              {error.doctorError.message ||
                (isDisabled && "Choose a Hospital first")}
            </FormHelperText>
          </FormControl>
          <TextField
            value={date}
            id="date"
            name="date"
            type="date"
            error={error.dateError.state}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            helperText={error.dateError.message}
          />
          <TextField
            value={time}
            id="time"
            name="time"
            type="time"
            error={error.timeError.state}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            helperText={error.timeError.message}
          />
          <FormControl>
            <TextField
              label="Charges"
              value={fees}
              id="Charges"
              disabled={true}
            />
            <FormHelperText>
              Filled Automatically, kindly choose the doctor
            </FormHelperText>
          </FormControl>
          <FormControl error={error.paymentMethodError.state}>
            <InputLabel id="paymentTypeLabel">Select Payment Method</InputLabel>
            <Select
              labelId="paymentTypeLabel"
              id="paymentMethod"
              label="Select Payment Method"
              name="paymentMethod"
              value={paymentMethod}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
            </Select>
            <FormHelperText>{error.paymentMethodError.message}</FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            onClick={appointmentHandler}
            disabled={
              error.nameError.state ||
              error.dateError.state ||
              error.diseaseError.state ||
              error.hospitalError.state ||
              error.paymentMethodError.state ||
              error.emailError.state ||
              error.doctorError.state
            }
          >
            Book Appointment
          </Button>
        </Grid2>
      </Form>
    </Box>
  );
}
