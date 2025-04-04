import { useEffect, useState } from "react";
import useAuth from "../../../util/useAuth";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  Grid2,
  Icon,
  Input,
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
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import PropTypes, { exact } from "prop-types";
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
  Search,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Link, useNavigate, useNavigation } from "react-router";
import ModalContent from "../../Modal/ModalContent";
import { deepOrange, indigo } from "@mui/material/colors";
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "lodash";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchSpecializations,
  getPaginatedDoctors,
  queryClient,
} from "../../../util/http";
import { useDebounce } from "use-debounce";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Doctors() {
  const [specialization, setSpecialization] = useState(0);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (localStorage.getItem("op")) {
      notify();
      localStorage.removeItem("op");
    }
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

  function createData(id, name, specialization, city, hospital, status) {
    return { id, name, specialization, city, hospital, status };
  }

  const rows = fetchedDoctors.map((eachDoctor) =>
    createData(
      eachDoctor.id,
      eachDoctor.name,
      eachDoctor.specialization.name,
      eachDoctor.city.name,
      eachDoctor.hospital.name,
      eachDoctor.status
    )
  );

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [searchTerm] = useDebounce(keyword, 600);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: [
      "paginated-doctors",
      page,
      rowsPerPage,
      specialization,
      searchTerm,
    ],
    queryFn: () =>
      getPaginatedDoctors({ page, rowsPerPage, specialization, searchTerm }),
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
  function searchChangeHandler(e) {
    setKeyword(e.target.value);
  }
  function onClose() {
    setShowPrompt((prevState) => ({
      ...prevState,
      state: false,
      message: {
        message: "",
        caption: "",
      },
    }));
    queryClient.invalidateQueries({
      queryKey: ["paginated-doctors"],
      exact: false,
    });
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
  const { data: specializations } = useQuery({
    queryKey: ["fetch-all-specializations"],
    queryFn: fetchSpecializations,
    staleTime: 1000 * 60 * 5,
  });

  function notify() {
    toast.success(localStorage.getItem("op"));
  }
  useEffect(() => {
    if (data) {
      setFetchedDoctors(data.fetchedDoctors);
      setTotalCount(data.totalRecords);
    }
  }, [data]);

  if (isPending) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={460}
        sx={{ borderRadius: "10px" }}
      />
    );
  } else if (isError) {
    toast.error(error.message);
    console.log("Error: ", error);
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
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ marginBottom: "1.5rem" }}
      >
        Doctors
      </Typography>
      <Grid2
        display="flex"
        justifyContent="space-between"
        gap="10rem"
        alignItems="center"
      >
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="Search here"
          value={keyword}
          onChange={(e) => searchChangeHandler(e)}
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
        <Grid2 sx={{ display: "flex", gap: "1rem" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              id="specialization"
              name="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              sx={{ marginBottom: "5px", width: "13rem" }}
              onClick={() => setPage(0)}
              size="small"
            >
              <MenuItem id="all" value={0}>
                Select Specialization
              </MenuItem>
              {!specializations ? (
                <Grid2 display="flex" justifyContent="center">
                  <CircularProgress />
                </Grid2>
              ) : (
                specializations.map((eachSpecialization) => (
                  <MenuItem
                    id={eachSpecialization.name}
                    key={eachSpecialization.id}
                    value={eachSpecialization.id}
                  >
                    {eachSpecialization.name}
                  </MenuItem>
                ))
              )}
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
              Add Doctor
            </Button>
          </Link>
        </Grid2>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">No doctors found for the selected filter</Alert>
      )}
      <Toaster />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ marginBottom: "2rem" }}>
              <TableCell>
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Specialization
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  City
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Hospital
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 100 }} component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell style={{ width: 200 }} component="th" scope="row">
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
                  {row.status ? (
                    <Tooltip title="active">
                      <Icon
                        sx={{ height: "2rem", width: "2rem", color: "green" }}
                      >
                        <ToggleOn sx={{ fontSize: "2rem" }} />
                      </Icon>
                    </Tooltip>
                  ) : (
                    <Tooltip title="inactive">
                      <Icon
                        sx={{ height: "2rem", width: "2rem", color: "red" }}
                      >
                        <ToggleOff sx={{ fontSize: "2rem" }} />
                      </Icon>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell
                  style={{ width: 160 }}
                  align="center"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
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
                    <Tooltip title="Mark Inactive">
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
                colSpan={5}
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
                // disabled={isPlaceholderData || !data?.hasMore}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
