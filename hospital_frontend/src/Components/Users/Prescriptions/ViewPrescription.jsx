import { ArrowBack, ArrowLeft, BackHand, Backspace } from "@mui/icons-material";
import { Grid2, IconButton, Typography } from "@mui/material";
import { ReactFormGenerator } from "react-form-builder2";

export default function ViewPrescription({ prescription, toggleViewMode }) {
  return (
    <>
      <IconButton onClick={() => toggleViewMode(false)}>
        <ArrowBack />
      </IconButton>
      <Grid2
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="1rem"
        sx={{
          backgroundColor: "white",
          maxWidth: "50%",
          margin: "auto",
          boxShadow: "0px 1px 2px 0px cyan",
          padding: "3rem",
          borderRadius: "2rem",
        }}
      >
        <Typography variant="h4" align="center" sx={{ marginBottom: "1.2rem" }}>
          {prescription.doctor.hospital.name}
        </Typography>
        <Grid2 display="flex" flexDirection="column">
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Patient Name:
          </Typography>
          <Typography variant="p">
            {prescription.associatedPatient.name}
          </Typography>
        </Grid2>
        <Grid2 display="flex" flexDirection="column">
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Suffering from:
          </Typography>
          <Typography variant="p">
            {prescription.associatedPatient.disease.name}
          </Typography>
        </Grid2>
        <Grid2 display="flex" flexDirection="column">
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Attending doctor:
          </Typography>
          <Typography variant="p">{prescription.doctor.name}</Typography>
        </Grid2>
        <Grid2 display="flex" flexDirection="column">
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Prescription:
          </Typography>
          <Grid2 sx={{ flexShrink: 1 }}>
            {JSON.parse(prescription.medicines).map((eachMed) => (
              <Typography variant="p">{eachMed.name}, </Typography>
            ))}
          </Grid2>
        </Grid2>
        <Grid2 display="flex" flexDirection="column">
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Additional notes:
          </Typography>
          <Grid2 sx={{ flexShrink: 1 }}>
            {prescription.notes}
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
}
