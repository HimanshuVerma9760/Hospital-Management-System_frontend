import { useEffect, useState } from "react";
import useAuth from "../../../util/useAuth";
import {
  Alert,
  Button,
  Grid2,
  Icon,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import {
  Add,
  Delete,
  Edit,
  Restore,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { indigo } from "@mui/material/colors";
import ModalContent from "../../Modal/ModalContent";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Hospitals() {
  const [isVerified, setIsVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedHospitals, setFetchedHospitals] = useState([]);
  // const [message, setMessage] = useState("");
  const [op, setOp] = useState(false);
  const [showPrompt, setShowPrompt] = useState({
    state: false,
    type: "",
    message: {
      message: "",
      caption: "",
    },
  });
  const reqId = React.useRef();

  useEffect(() => {
    if (localStorage.getItem("op")) {
      setOp(true);
    }
  }, [op]);

  // useEffect(() => {
  //   if (message.length > 0) {
  //     setTimeout(() => {
  //       setMessage("");
  //     }, 2000);
  //   }
  // }, [message]);
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

  function createData(id, name, status, location, city, Doctors) {
    return { id, name, status, location, city, Doctors };
  }

  const rows = fetchedHospitals.map((eachHospital) =>
    createData(
      eachHospital.id,
      eachHospital.name,
      eachHospital.status,
      eachHospital.location,
      eachHospital.city.name,
      eachHospital.doctor.length
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
            `${Conn}/hospitals/get/?page=${page + 1}&limit=${rowsPerPage}`,
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const result = await response.json();

          if (response.ok) {
            setFetchedHospitals(result.result);
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
  }, [page, rowsPerPage, showPrompt.state]);
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
  const navigate = useNavigate();
  function editHandler(id) {
    localStorage.setItem("id", id);
    navigate("edit");
  }

  function deleteHandler(id) {
    reqId.current = id;
    setShowPrompt((prevState) => ({
      ...prevState,
      state: true,
      type: "deleteHospital",
      message: {
        message: "Delete Hospital",
        caption: "This will wark the selected hospital as inactive",
      },
    }));
  }
  function restoreHandler(id) {
    reqId.current = id;
    setShowPrompt((prevState) => ({
      ...prevState,
      type: "restoreHospital",
      state: true,
      message: {
        message: "Restore Hospital",
        caption: "This will mark the hospital active again",
      },
    }));
  }
  function editHospitalHandler(id) {
    localStorage.setItem("id", id);
    navigate("edit");
  }

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
  if (localStorage.getItem("op")) {
    setTimeout(() => {
      localStorage.removeItem("op");
      setOp(false);
    }, 2000);
  }
  return (
    <>
      <Typography variant="h4" align="center">
        Hospitals
      </Typography>
      <Grid2 display="flex" justifyContent="end">
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
            Add Hospital
          </Button>
        </Link>
      </Grid2>
      {op && <Alert severity="success">{localStorage.getItem("op")}</Alert>}
      {/* {message && <Alert severity="success">{message}</Alert>} */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ marginBottom: "2rem" }}>
              <TableCell>
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Location
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  City
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Doctors (#)
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="green"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell style={{ width: 160 }} scope="row">
                  {row.id}
                </TableCell>
                <TableCell style={{ width: 160 }} scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.location}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.city}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Doctors}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.status ? (
                    <Tooltip title="active">
                      <Icon
                        sx={{ width: "3rem", height: "2rem", color: "green" }}
                      >
                        <ToggleOn />
                      </Icon>
                    </Tooltip>
                  ) : (
                    <Tooltip title="inactive">
                      <Icon
                        sx={{ width: "3rem", height: "2rem", color: "red" }}
                      >
                        <ToggleOff />
                      </Icon>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell
                  style={{ width: 160 }}
                  sx={{ display: "flex", justifyContent: "left", gap: "2rem" }}
                  align="center"
                >
                  <Tooltip title="edit">
                    <IconButton onClick={() => editHospitalHandler(row.id)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  {row.status ? (
                    <Tooltip title="delete">
                      <IconButton
                        onClick={() => deleteHandler(row.id)}
                        sx={{ color: "red" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="restore">
                      <IconButton onClick={() => restoreHandler(row.id)}>
                        <Restore />
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
                colSpan={6}
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
