import {
  Alert,
  Box,
  Button,
  Grid2,
  Input,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ReactFormBuilder, ReactFormGenerator } from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import EditForm from "./EditForm";
import { useNavigate } from "react-router";
// import "./CreateForm.css";
const Conn = import.meta.env.VITE_CONN_URI;

export default function CreateForm() {
  const [formData, setFormData] = useState([]);
  const formTitle = useRef();
  const formDescription = useRef();
  const [viewMode, setViewMode] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  formTitle.current = localStorage.getItem("title");
  formDescription.current = localStorage.getItem("description");
  function handleSave(data) {
    setFormData(data.task_data);
  }

  useEffect(() => {
    if (!localStorage.getItem("title")) {
      navigate("/users/forms");
    } else {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.querySelector(
        ".react-form-builder-preview"
      )?.parentElement;
      const toolbar = document.querySelector(".react-form-builder-toolbar");
      if (toolbar) {
        toolbar.style.margin = "0px";
      }
      if (container) {
        container.style.display = "flex";
        container.style.gap = "15px";
        container.style.alignItems = "start";

        // clearInterval(interval);
      }
      clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  async function handleFormSave() {
    if (formData.length === 0) {
      setMessage("Form Cannot be Empty");
      return;
    }
    const rawFromData = {
      title: formTitle.current,
      description: formDescription.current,
      inputType: JSON.stringify(formData),
    };
    const response = await fetch(`${Conn}/form/create`, {
      method: "post",
      body: JSON.stringify(rawFromData),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      navigate("/users/forms");
    }
  }
  if (isLoading) {
    return (
      <>
        <Grid2 display="flex" justifyContent="center">
          <Skeleton variant="rectangular" height={300} width={300} />
        </Grid2>
      </>
    );
  }
  return (
    <Box p={3}>
      <Grid2
        display="flex"
        justifyContent="center"
        sx={{ marginBottom: "2rem" }}
      >
        {viewMode ? (
          <Typography variant="h5">"Preview Form"</Typography>
        ) : (
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
            {formTitle.current}
          </Typography>
        )}
      </Grid2>

      {viewMode ? (
        <ReactFormGenerator
          form_action="/submit-form"
          form_method="POST"
          task_id={1}
          data={formData}
        />
      ) : (
        <>
          {message && <Alert severity="error">{message}</Alert>}
          <div className="react-form-builder-container">
            <ReactFormBuilder
              onPost={handleSave}
              edit
              data={formData}
              renderEditForm={(props) => <EditForm {...props} />}
            />
          </div>
        </>
      )}

      <Box mt={2} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setViewMode(!viewMode)}
          sx={{ mr: 2 }}
        >
          {viewMode ? "Edit Form" : "Preview Form"}
        </Button>

        <Button variant="contained" color="secondary" onClick={handleFormSave}>
          Save Form
        </Button>
      </Box>
    </Box>
  );
}
