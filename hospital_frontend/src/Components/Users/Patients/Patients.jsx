import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  LinearProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  TableHead,
  TextField,
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
import { Add, Search } from "@mui/icons-material";
import { Link } from "react-router";
import { indigo } from "@mui/material/colors";
import { debounce } from "lodash";
import { useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDiseases, getPaginatedPatients } from "../../../util/http";
import { useDebounce } from "use-debounce";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Patients() {
  const [disease, setDisease] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchTerm] = useDebounce(keyword, 600);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { data, isPending } = useQuery({
    queryKey: ["fetch-all-patients", page, rowsPerPage, disease, searchTerm],
    queryFn: () =>
      getPaginatedPatients({ page, rowsPerPage, disease, searchTerm }),
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
  const totalCount = data?.totalRecords;

  const { data: diseases } = useQuery({
    queryKey: ["fetch-all-diseases"],
    queryFn: fetchDiseases,
  });

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

  const rows = data?.fetchedPatients.map((eachPatient) =>
    createData(
      eachPatient.id,
      eachPatient.name,
      eachPatient.city.name,
      eachPatient.hospital.name,
      eachPatient.disease.name,
      eachPatient.doctor.name
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isPending) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={460}
        sx={{ borderRadius: "10px" }}
      />
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ marginBottom: "1.5rem" }}
      >
        Patients
      </Typography>
      <Grid2 display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="Search here"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <Search sx={{ fontSize: "1.5rem" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: "30rem" }}
        />
        <Grid2 display="flex" gap="1rem">
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              id="Disease"
              name="Disease"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              sx={{ marginBottom: "5px", width: "10rem" }}
              onClick={() => setPage(0)}
              size="small"
            >
              <MenuItem id="all" value={0}>
                Select Disease
              </MenuItem>
              {diseases?.map((eachDisease) => (
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
                backgroundColor: indigo[300],
                marginBottom: "5px",
                paddingTop: "8px",
                paddingBottom: "8px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              Add Patient
            </Button>
          </Link>
        </Grid2>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">No Patient found for the selected disease</Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ marginBottom: "2rem" }}>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  City
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Hospital
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Disease
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Doctor
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" style={{ width: 100 }} scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" style={{ width: 160 }} scope="row">
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
