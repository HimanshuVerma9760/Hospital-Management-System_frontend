import { ArrowBack, ArrowLeft, BackHand, Backspace } from "@mui/icons-material";
import { Grid2, IconButton } from "@mui/material";
import { ReactFormGenerator } from "react-form-builder2";

export default function ViewForm({ forms, toggleViewMode}) {
    
  return (
    <>
      <IconButton onClick={()=>toggleViewMode(false)}>
        <ArrowBack />
      </IconButton>
      <Grid2
        display="flex"
        justifyContent="center"
        sx={{
          backgroundColor: "white",
          maxWidth: "50%",
          margin: "auto",
          boxShadow: "0px 1px 2px 0px cyan",
          padding:"3rem",
          borderRadius:"2rem"
        }}
      >
        <ReactFormGenerator
          data={JSON.parse(forms[0].inputType)}
          form_method="POST"
          form_action="/submit"
        />
      </Grid2>
    </>
  );
}
