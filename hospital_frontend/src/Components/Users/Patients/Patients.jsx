import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  Grid2,
  InputLabel,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  TableHead,
  Typography,
} from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Add } from "@mui/icons-material";
import { Link } from "react-router";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Patients() {
  const [disease, setDisease] = useState(0);
  const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedPatients, setFetchedPatients] = useState([]);

  async function fetchDiseases() {
    const response = await fetch(`${Conn}/diseases`);
    if (response.ok) {
      const result = await response.json();
      setDiseases(result.result);
    } else {
      console.log("Some error occured");
    }
  }
  useEffect(() => {
    fetchDiseases();
  }, []);
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  function createData(id, name, city, hospital, disease, Doctor) {
    return { id, name, city, hospital, disease, Doctor };
  }

  const rows = fetchedPatients.map((eachPatient) =>
    createData(
      eachPatient.id,
      eachPatient.name,
      eachPatient.city.name,
      eachPatient.hospital.name,
      eachPatient.disease.name,
      eachPatient.doctor.name
    )
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const response = await fetch(
          `${Conn}/patients/?page=${
            page + 1
          }&limit=${rowsPerPage}&disease=${disease}`
        );
        const result = await response.json();
        if (response.ok) {
          setFetchedPatients(result.result);
          setTotalCount(result.totalRecords);
        } else {
          console.error("Error fetching doctors:", result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [page, rowsPerPage, disease]);

  if (isLoading) {
    return (
      <>
        <Skeleton variant="rectangular" height={100} />
        <Skeleton variant="text" height={80} width={300} />
        <Skeleton variant="rectangular" height={100} />
      </>
    );
  }

  return (
    <>
      <Grid2 display="flex" justifyContent="end" gap="1rem" alignItems="center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="Disease">Disease</InputLabel>
          <Select
            labelId="Disease"
            label="Disease"
            id="Disease"
            name="Disease"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            sx={{ marginBottom: "5px" }}
            onClick={() => setPage(0)}
          >
            <MenuItem id="all" value={0}>
              All
            </MenuItem>
            {diseases.map((eachDisease) => (
              <MenuItem
                key={eachDisease.id}
                id={eachDisease.name}
                value={eachDisease.id}
              >
                {eachDisease.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Link to="add" style={{ textDecoration: "none", color: "black" }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: "6px",
              backgroundColor: "green",
              marginBottom: "5px",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <Add />
            </ListItemIcon>
            <ListItemText sx={{ color: "white", paddingRight: "5px" }}>
              Add Patient
            </ListItemText>
          </Button>
        </Link>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">No Patient found for the selected disease</Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ marginBottom: "2rem" }}>
              <TableCell>
                <Typography variant="h5" color="green">
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5" color="green">
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  City
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Hospital
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Disease
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Doctor
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.city}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.hospital}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.disease}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Doctor}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
