import { useEffect, useState } from "react";
import useAuth from "../../../util/useAuth";
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
import { Add, Delete, Edit, Restore } from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import ModalContent from "../../Modal/ModalContent";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Doctors() {
  const [specialization, setSpecialization] = useState("all");
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedDoctors, setFetchedDoctors] = useState([]);
  const [showPrompt, setShowPrompt] = useState({
    state: false,
    type: "",
    message: {
      message: "",
      caption: "",
    },
  });
  const reqId = React.useRef();

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

  function createData(id, name, specialization, city, hospital, status) {
    return { id, name, specialization, city, hospital, status };
  }

  const rows = fetchedDoctors.map((eachDoctor) =>
    createData(
      eachDoctor.id,
      eachDoctor.name,
      eachDoctor.specialization,
      eachDoctor.city.name,
      eachDoctor.hospital.name,
      eachDoctor.status
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
    async function checkAuth() {
      const verfiedUser = await useAuth();
      if (
        !(
          verfiedUser.response &&
          (verfiedUser.role === "Super-Admin" || verfiedUser.role === "Admin")
        )
      ) {
        setIsVerified(false);
      } else {
        try {
          const response = await fetch(
            `${Conn}/doctors/get-doctors/${localStorage.getItem(
              "token"
            )}/?page=${
              page + 1
            }&limit=${rowsPerPage}&specialization=${specialization}`
          );

          if (response.ok) {
            const result = await response.json();
            setFetchedDoctors(result.result);
            setTotalCount(result.totalRecords);
          } else {
            console.error("Error fetching doctors:", result);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [page, rowsPerPage, showPrompt.state, specialization]);

  function onClose() {
    setShowPrompt((prevState) => ({
      ...prevState,
      state: false,
      message: {
        message: "",
        caption: "",
      },
    }));
  }
  function deleteHandler(id) {
    reqId.current = id;
    setShowPrompt((prevState) => ({
      ...prevState,
      state: true,
      type: "delete",
      message: {
        message: "Delete Doctor",
        caption: "This will wark the selected doctor as inactive",
      },
    }));
  }
  function restoreHandler(id) {
    reqId.current = id;
    setShowPrompt((prevState) => ({
      ...prevState,
      type: "restore",
      state: true,
      message: {
        message: "Restore Doctor",
        caption: "This will mark the doctor active again",
      },
    }));
  }
  function editHandler(id) {
    localStorage.setItem("id", id);
    navigate("edit");
  }
  const [specializations, setSpecializations] = useState([]);
  useEffect(() => {
    async function getSpecialization() {
      const response = await fetch(`${Conn}/specializations`);
      if (response.ok) {
        const result = await response.json();
        setSpecializations(result.result);
      } else {
        console.error("Error fetching specializations:", result);
      }
    }
    getSpecialization();
  }, []);

  if (isLoading) {
    return (
      <>
        <Skeleton variant="rectangular" height={100} />
        <Skeleton variant="text" height={80} width={300} />
        <Skeleton variant="rectangular" height={100} />
      </>
    );
  } else if (!isVerified) {
    return (
      <Alert severity="error">
        You Are Not Authorised to view this page. Kindly{" "}
        <Link to="/">Login</Link>
      </Alert>
    );
  } else if (showPrompt.state) {
    return (
      <ModalContent
        btn="Are you sure"
        isOpen={showPrompt.state}
        onClose={onClose}
        message={{
          message: showPrompt.message.message,
          caption: showPrompt.message.caption,
          id: reqId.current,
        }}
        type={showPrompt.type}
      />
    );
  }
  return (
    <>
      <Grid2 display="flex" justifyContent="end" gap="1rem" alignItems="center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="specialization">Specialization</InputLabel>
          <Select
            labelId="specialization"
            label="Specialization"
            id="specialization"
            name="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            sx={{ marginBottom: "5px" }}
            onClick={() => setPage(0)}
          >
            <MenuItem id="all" value="all">
              All
            </MenuItem>
            {specializations.map((eachSpecialization) => (
              <MenuItem
                id={eachSpecialization.name}
                key={eachSpecialization.id}
                value={eachSpecialization.name}
              >
                {eachSpecialization.name}
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
              Add Doctor
            </ListItemText>
          </Button>
        </Link>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">No doctors found for the selected filter</Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ marginBottom: "2rem" }}>
              <TableCell>
                <Typography variant="h5" color="green">
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Specialization
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
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.specialization}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.city}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.hospital}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.status ? "Active" : "Inactive"}
                </TableCell>
                <TableCell
                  style={{ width: 160 }}
                  align="center"
                  sx={{ display: "flex", justifyContent: "left", gap: "2rem" }}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => editHandler(row.id)}
                      sx={{ color: "lightslategray" }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  {!row.status ? (
                    <Tooltip title="Restore">
                      <IconButton sx={{ color: "lightslategray" }}>
                        <Restore onClick={() => restoreHandler(row.id)} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: "red" }}>
                        <Delete onClick={() => deleteHandler(row.id)} />
                      </IconButton>
                    </Tooltip>
                  )}
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
