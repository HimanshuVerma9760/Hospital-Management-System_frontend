import { ArrowBack } from "@mui/icons-material";
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
  IconButton,
  Select,
  Skeleton,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router";
import useAuth from "../../../util/useAuth";
import toast, { Toaster } from "react-hot-toast";
const Conn = import.meta.env.VITE_CONN_URI;

export default function EditPrescription({
  toggleMode,
  prescription,
  getPrescriptionsData,
  notifyUpdate,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [submissionProgress, setSubmissionProgress] = useState(false);
  const [name, setName] = useState(prescription.associatedPatient.id);
  const [medicine, setMedicine] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notes, setNotes] = useState(prescription.notes);
  //   const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const doctor = useRef({ name: "", id: "", userId: "" });
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    notesError: {
      state: false,
      message: "",
    },
    medicineError: {
      state: false,
      message: "",
    },
  });

  useEffect(() => {
    if (medicines.length > 0) {
      setMedicine(
        JSON.parse(prescription.medicines).map((eachMed) => eachMed.id)
      );
    }
  }, [medicines]);
  async function fetchPatients() {
    const response = await fetch(`${Conn}/patients/get-all`);
    if (response.ok) {
      const result = await response.json();
      setPatients(result.result);
    } else {
      console.log("Some error occured");
    }
  }

  async function fetchMedicines() {
    const response = await fetch(`${Conn}/medicines/get-all`);
    if (response.ok) {
      const result = await response.json();
      setMedicines(result.result);
    } else {
      console.log("Some error occured");
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const verifiedUser = await useAuth();
      if (!(verifiedUser.response && verifiedUser.role === "Doctor")) {
        setIsVerified(false);
      } else {
        doctor.current.name = verifiedUser.name;
        doctor.current.id = verifiedUser.id;
        doctor.current.userId = verifiedUser.userId;
        setIsLoading(false);
        fetchPatients();
        fetchMedicines();
      }
      setIsLoading(false);
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
      case "medicine":
        setMedicine(value);
        setError((prevState) => ({
          ...prevState,
          medicineError: {
            state: false,
            message: "",
          },
        }));
        break;
      case "notes":
        setNotes(value);
        setError((prevState) => ({
          ...prevState,
          notesError: {
            state: false,
            message: "",
          },
        }));
        break;
      default:
        break;
    }
  }

  function onBlurHandler(event) {
    const id = event.target.id || event.target.name;
    const value = event.target.value;
    switch (id) {
      case "name":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            nameError: {
              state: true,
              message: "Invalid Name",
            },
          }));
        }
        break;

      case "medicine":
        if (value.length === 0) {
          setError((prevState) => ({
            ...prevState,
            medicineError: {
              state: true,
              message: "Invalid value",
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
    let prescribedMedicines = [];
    for (let index = 0; index < medicine.length; index++) {
      const element = medicine[index];
      prescribedMedicines.push(
        medicines.find((eachMedicine) => eachMedicine.id === element)
      );
    }
    setSubmissionProgress(true);
    const formData = {
      patient: name,
      providedBy: prescription.doctor.id,
      medicines: JSON.stringify(prescribedMedicines),
      notes: notes,
    };

    try {
      const response = await fetch(
        `${Conn}/prescriptions/edit/${prescription.id}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response) {
        const result = await response.json();
        setSubmissionProgress(false);
        if (response.ok) {
          notifyUpdate();
          getPrescriptionsData();
          toggleMode(false);
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

  if (isLoading) {
    return <LinearProgress />;
  } else if (!isVerified) {
    return (
      <Alert severity="error">
        You are not authorized to perform this action
      </Alert>
    );
  }
  return (
    <>
      <IconButton onClick={() => toggleMode(false)}>
        <ArrowBack />
      </IconButton>
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
            Edit Prescription
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
              gap: "1rem",
              paddingLeft: "5rem",
              paddingRight: "5rem",
              paddingBottom: "1.5rem",
              paddingTop: "1rem",
            }}
          >
            <FormControl error={error.nameError.state}>
              <InputLabel id="patientNameLabel">Patient name</InputLabel>
              <Select
                labelId="patientNameLabel"
                id="name"
                name="name"
                label="Patient name"
                value={name}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                size="medium"
              >
                {patients.map((eachPatient) => (
                  <MenuItem
                    id={eachPatient.id}
                    value={eachPatient.id}
                    key={eachPatient.id}
                  >
                    {eachPatient.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.nameError.message}</FormHelperText>
            </FormControl>
            <FormControl error={error.medicineError.state}>
              <InputLabel id="medicinesLabel">Medicines</InputLabel>
              <Select
                labelId="medicinesLabel"
                id="medicine"
                name="medicine"
                label="medicine"
                multiple={true}
                multiline={true}
                value={medicine}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                size="medium"
                sx={{ maxWidth: "27rem" }}
              >
                {medicines.map((eachMedicine) => (
                  <MenuItem
                    id={eachMedicine.id}
                    value={eachMedicine.id}
                    key={eachMedicine.id}
                  >
                    {eachMedicine.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.medicineError.message}</FormHelperText>
            </FormControl>
            <TextField
              name="notes"
              id="notes"
              label="Additional Notes (Optional)"
              type="text"
              multiline={true}
              rows={3}
              value={notes}
              onChange={onChangeHandler}
              helperText={error.notesError.state && error.notesError.message}
              size="medium"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "green" }}
              disabled={error.nameError.state || error.medicineError.state}
            >
              Add
            </Button>
          </Grid2>
        </Form>
      </Box>
    </>
  );
}
