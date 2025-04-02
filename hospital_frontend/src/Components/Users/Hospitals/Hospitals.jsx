import { useEffect, useState } from "react";
import useAuth from "../../../util/useAuth";
import {
  Alert,
  Button,
  Grid2,
  Icon,
  InputAdornment,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { debounce } from "lodash";
import {
  Add,
  Delete,
  Edit,
  Restore,
  Search,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { indigo } from "@mui/material/colors";
import ModalContent from "../../Modal/ModalContent";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPaginatedHospitals, queryClient } from "../../../util/http";
import { useDebounce } from "use-debounce";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Hospitals() {
  const [fetchedHospitals, setFetchedHospitals] = useState([]);
  const [page, setPage] = React.useState(0);
  const [keyword, setKeyword] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [searchTerm] = useDebounce(keyword, 600);
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
      notify("success");
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

  function createData(id, name, status, location, city, Doctors) {
    return { id, name, status, location, city, Doctors };
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["paginated-hospitals", page, rowsPerPage, searchTerm],
    queryFn: () => getAllPaginatedHospitals({ page, rowsPerPage, searchTerm }),
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });

  const notify = (response) => {
    if (response === "success") {
      toast.success("Hospital successfully updated");
    } else {
      toast.error(response);
    }
  };

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
      queryKey: ["paginated-hospitals", page, rowsPerPage, searchTerm],
    });
  }
  const navigate = useNavigate();

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
  let rows = [];
  if (data) {
    rows = data.fetchedHospitals.map((eachHospital) =>
      createData(
        eachHospital.id,
        eachHospital.name,
        eachHospital.status,
        eachHospital.location,
        eachHospital.city.name,
        eachHospital.doctor.length
      )
    );
  }

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={460}
        sx={{ borderRadius: "10px" }}
      />
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
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ marginBottom: "1.5rem" }}
      >
        Hospitals
      </Typography>
      <Toaster />
      <Grid2 display="flex" justifyContent="space-between">
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="Search here"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            // debouncedFetchData();
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
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
                  Location
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
                  Doctors (#)
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
                        sx={{ width: "2rem", height: "2rem", color: "green" }}
                      >
                        <ToggleOn sx={{ fontSize: "2rem" }} />
                      </Icon>
                    </Tooltip>
                  ) : (
                    <Tooltip title="inactive">
                      <Icon
                        sx={{ width: "2rem", height: "2rem", color: "red" }}
                      >
                        <ToggleOff sx={{ fontSize: "2rem" }} />
                      </Icon>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell
                  style={{ width: 160 }}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
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
                colSpan={5}
                count={data?.totalRecords}
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
