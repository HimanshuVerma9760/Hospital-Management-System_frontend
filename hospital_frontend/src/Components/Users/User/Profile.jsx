import { Image } from "@mui/icons-material";
import {
  Alert,
  Button,
  Grid2,
  ImageListItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const Conn = import.meta.env.VITE_CONN_URI;
const folder = import.meta.env.VITE_FOLDER_URI;
export default function Profile() {
  //   const [userData, setUserData] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const dp = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);
  const pickImage = useRef();
  const [error, setError] = useState({
    nameError: {
      state: false,
      message: "",
    },
    emailError: {
      state: false,
      message: "",
    },
  });
  async function uploadHandler() {
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      const response = await fetch(`${Conn}/upload/dp`, {
        method: "post",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (response.ok) {
        toast.success("Successfully Updated Profile");
      } else {
        const result = await response.json();
        console.log(result.message);
        toast.error("Error occurred while updating profile");
      }
    } catch (error) {
      toast.error("Error occured at backend!");
    }
  }
  async function onSubmitHandler() {
    if (!isValidEmail(email)) {
      setError((prevState) => ({
        ...prevState,
        emailError: {
          state: true,
          message: "Invalid Email",
        },
      }));
      return;
    }
    const response = await fetch(`${Conn}/users/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });
    if (response.ok) {
      //   toast.success("Successfully updated your profile");
      if (pickedImage) {
        uploadHandler();
      } else {
        toast.success("Successfully updated profile");
      }
    } else {
      toast.error("Profile could not be updated, try again later!");
    }
  }
  async function getUserData() {
    const response = await fetch(`${Conn}/users/get-user`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const result = await response.json();
      console.log(result.result);
      setName(result.result.name);
      setEmail(result.result.email);
      dp.current = result.result.dp;
    } else {
      setShowAlert(true);
    }
    setIsLoading(false);
  }
  function onChangeHandler(event) {
    const id = event.target.id;
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
          nameError: {
            state: false,
            message: "",
          },
        }));
        break;
      default:
        break;
    }
  }
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  function onBlurHandler(event) {
    const id = event.target.id;
    const value = event.target.value;
    switch (id) {
      case "name":
        if (value.trim().length === 0) {
          setError((prevState) => ({
            ...prevState,
            nameError: {
              state: true,
              message: "Name cannot be empty",
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
              message: "Invalid Email",
            },
          }));
        }
        break;
      default:
        break;
    }
  }
  function imageChangeHandler(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setProfilePicture(file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }
  useEffect(() => {
    getUserData();
  }, []);
  if (isLoading) {
    return <Skeleton variant="rectangular" height={450} width="100%" />;
  } else if (showAlert) {
    return (
      <Alert severity="error">Something went wrong, try again later!</Alert>
    );
  }
  return (
    <>
      <Typography
        variant="h5"
        // align="Left"
        sx={{ fontWeight: "bold", marginBottom: "2rem" }}
      >
        My Profile
      </Typography>
      <Toaster />
      <Grid2
        sx={{
          //   flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <Grid2 sx={{ display: "flex" }}>
          <Grid2 sx={{ textAlign: "center" }}>
            <label htmlFor="profilePicture">
              <ImageListItem
                sx={{
                  height: "20rem",
                  width: "10rem",
                  margin: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed gray",
                  cursor: "pointer",
                  borderRadius: "5px",
                  overflow: "hidden",
                  backgroundColor: profilePicture ? "transparent" : "#f0f0f0",
                  color: "#777",
                }}
              >
                {profilePicture ? (
                  <img
                    src={pickedImage}
                    alt="User's profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : dp.current ? (
                  <img
                    src={`${folder}/uploads/dp/${dp.current}`}
                    alt="User's profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    component="p"
                    sx={{
                      color: "gray",
                      paddingTop: "3rem",
                      paddingBottom: "3rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <Image sx={{ alignSelf: "center" }} />
                    Click to upload
                  </Typography>
                )}
              </ImageListItem>
            </label>

            <input
              ref={pickImage}
              type="file"
              name="profilePicture"
              id="profilePicture"
              accept="image/*"
              onChange={imageChangeHandler}
              style={{ display: "none" }}
            />
          </Grid2>

          <Grid2
            display="flex"
            flexDirection="column"
            sx={{ ml: "1rem", gap: "0.7rem" }}
          >
            <Typography variant="p" sx={{ fontWeight: "bold", color: "gray" }}>
              Name*
            </Typography>
            <TextField
              placeholder="Name"
              size="small"
              value={name}
              autoFocus
              id="name"
              error={error.nameError.state}
              helperText={error.nameError.state && error.nameError.message}
              onBlur={onBlurHandler}
              name="name"
              onChange={onChangeHandler}
              sx={{ width: "23rem" }}
            />
          </Grid2>
          <Grid2
            display="flex"
            flexDirection="column"
            sx={{ ml: "1rem", gap: "0.7rem" }}
          >
            <Typography variant="p" sx={{ fontWeight: "bold", color: "gray" }}>
              Email*
            </Typography>
            <TextField
              placeholder="Email"
              type="email"
              size="small"
              value={email}
              error={error.emailError.state}
              helperText={error.emailError.state && error.emailError.message}
              id="email"
              onBlur={onBlurHandler}
              name="email"
              onChange={onChangeHandler}
              sx={{ width: "23rem" }}
            />
          </Grid2>
        </Grid2>
        <Grid2 display="flex" justifyContent="center">
          <Button
            onClick={onSubmitHandler}
            color="success"
            variant="contained"
            size="small"
            sx={{ marginTop: "1rem" }}
            disabled={error.nameError.state || error.emailError.state}
          >
            Submit
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
}
