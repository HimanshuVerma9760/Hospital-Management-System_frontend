import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Grid2,
  InputAdornment,
  Skeleton,
  TableHead,
  TextField,
  Tooltip,
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
import { indigo } from "@mui/material/colors";
import { useNavigate } from "react-router";
import useAuth from "../../../util/useAuth";
import { Edit, InfoOutlined, Search } from "@mui/icons-material";
import ViewPrescription from "./ViewPrescription";
import EditPrescription from "./EditPrescription";
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "lodash";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Prescriptions() {
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [viewFormMode, setViewFormMode] = useState({ state: false, id: "" });
  const [editMode, setEditMode] = useState({ state: false, id: "" });
  const [keyword, setKeyword] = useState("");
  const role = React.useRef();
  const navigate = useNavigate();

  function formatPrescription() {
    setMyPrescriptions((prevState) =>
      prevState.map((eachPrescription) => ({
        ...eachPrescription,
        medicines: JSON.parse(eachPrescription.medicines),
      }))
    );
  }

  async function getPrescriptionsData() {
    const verifiedUser = await useAuth();
    if (verifiedUser.response) {
      setIsVerified(true);
      role.current = verifiedUser.role;
    } else {
      return;
    }
    const response = await fetch(
      `${Conn}/prescriptions/get-all/${verifiedUser.id}/?page=${
        page + 1
      }&limit=${rowsPerPage}&keyword=${keyword}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const result = await response.json();
    if (response.ok) {
      setMyPrescriptions(result.result);
      formatPrescription();
      setTotalCount(result.totalRecords);
    }
    setIsLoading(false);
  }
  const debouncedFetchData = debounce(() => {
    getPrescriptionsData();
  }, 500);
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

  function createData(id, doctorName, patientName, dateOfPrescription, notes) {
    return { id, doctorName, patientName, dateOfPrescription, notes };
  }
  const rows = myPrescriptions.map((eachPrescription) =>
    createData(
      eachPrescription.id,
      eachPrescription.doctor.name,
      eachPrescription.associatedPatient.name,
      eachPrescription.createdAt,
      eachPrescription.notes
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
  function notifyUpdate() {
    toast.success("Successfully updated prescription");
  }
  useEffect(() => {
    getPrescriptionsData();
  }, [page, rowsPerPage]);
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
  else if (!isVerified) {
    return (
      <Alert severity="error">
        You are not authorised to access this page.
      </Alert>
    );
  }
  if (viewFormMode.state) {
    const prescription = myPrescriptions.filter(
      (eachPrescription) => eachPrescription.id === viewFormMode.id
    );
    return (
      <ViewPrescription
        prescription={prescription[0]}
        toggleViewMode={setViewFormMode}
      />
    );
  }
  if (editMode.state) {
    const prescription = myPrescriptions.find(
      (eachPrescription) => eachPrescription.id === editMode.id
    );
    return (
      <EditPrescription
        toggleMode={setEditMode}
        prescription={prescription}
        getPrescriptionsData={getPrescriptionsData}
        notifyUpdate={notifyUpdate}
      />
    );
  }
  return (
    <>
      <Grid2>
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          sx={{ marginBottom: "1.5rem" }}
        >
          Prescriptions
        </Typography>
        <Toaster />
        <Grid2
          display="flex"
          justifyContent="space-between"
          marginBottom="0.5rem"
        >
          <TextField
            variant="outlined"
            size="small"
            type="text"
            placeholder="Search here"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              debouncedFetchData();
            }}
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
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("create")}
            sx={{ backgroundColor: indigo[300] }}
          >
            Add Prescription
          </Button>
        </Grid2>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">
          No Prescriptions found, click Add Prescription to add{" "}
        </Alert>
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
                  Patient Name
                </Typography>
              </TableCell>
              {role.current !== "Doctor" && (
                <TableCell align="center">
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1.2rem" }}
                    color="black"
                  >
                    Prescribing Doctor
                  </Typography>
                </TableCell>
              )}

              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Prescribed On
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Additional notes
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 100 }}>{row.id}</TableCell>
                <TableCell style={{ width: 150 }}>{row.patientName}</TableCell>
                {role.current !== "Doctor" && (
                  <TableCell style={{ width: 200 }} align="center">
                    {row.doctorName}
                  </TableCell>
                )}

                <TableCell style={{ width: 160 }} align="center">
                  {row.dateOfPrescription.split("T")[0]}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {!row.notes ? "Empty" : row.notes}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  <Grid2
                    sx={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => setEditMode({ state: true, id: row.id })}
                        sx={{ color: indigo[300] }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Preview">
                      <IconButton
                        onClick={() => {
                          setViewFormMode({ state: true, id: row.id });
                        }}
                        sx={{ color: indigo[300] }}
                      >
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
                  </Grid2>
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
