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
import CheckoutPage from "./CheckoutPage";
const Conn = import.meta.env.VITE_CONN_URI;

export default function Appointments() {
  const [paymentStatus, setPaymentStatus] = useState(0);
  //   const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [isCard, setIsCard] = useState({
    state: false,
    orderDetails: {},
  });

  //   async function fetchDiseases() {
  //     const response = await fetch(`${Conn}/diseases`);
  //     if (response.ok) {
  //       const result = await response.json();
  //       setDiseases(result.result);
  //     } else {
  //       console.log("Some error occured");
  //     }
  //   }
  //   useEffect(() => {
  //     fetchDiseases();
  //   }, []);
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
  function splitDateTime(isoString) {
    const dateObj = new Date(isoString);

    const date = dateObj.toISOString().split("T")[0];

    let hours = dateObj.getUTCHours();
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    const time = `${hours}:${minutes} ${amPm}`;

    return { date, time };
  }

  function createData(
    id,
    appointment_id,
    name,
    email,
    dateTime,
    status,
    amount,
    paymentMethod,
    paymentStatus
  ) {
    const { date, time } = splitDateTime(dateTime);
    return {
      id,
      appointment_id,
      name,
      email,
      date,
      time,
      status,
      amount,
      paymentMethod,
      paymentStatus,
    };
  }

  const rows = fetchedOrders.map((eachOrder) =>
    createData(
      eachOrder.id,
      eachOrder.appointment_id,
      eachOrder.appointment.patientName,
      eachOrder.appointment.patientEmail,
      eachOrder.appointment.appointment_datetime,
      eachOrder.appointment.status,
      eachOrder.amount,
      eachOrder.paymentMethod,
      eachOrder.paymentStatus
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
          `${Conn}/orders/get-all/?page=${page + 1}&limit=${rowsPerPage}`
        );
        const result = await response.json();
        if (response.ok) {
          setFetchedOrders(result.result);
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
  }, [page, rowsPerPage, paymentStatus]);

  function paymentHandler(order) {
    // setIsLoading(false);
    setIsCard((prevState) => ({
      ...prevState,
      state: true,
      orderDetails: order,
    }));
  }

  if (isLoading) {
    return (
      <>
        <Skeleton variant="rectangular" height={100} />
        <Skeleton variant="text" height={80} width={300} />
        <Skeleton variant="rectangular" height={100} />
      </>
    );
  }
  if (isCard.state) {
    console.log(isCard.orderDetails);
    return <CheckoutPage order={isCard.orderDetails} />;
  }
  return (
    <>
      <Grid2 display="flex" justifyContent="end" gap="1rem" alignItems="center">
        {/* <FormControl sx={{ minWidth: 150 }}>
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
        </FormControl> */}
        <Link to="create" style={{ textDecoration: "none", color: "black" }}>
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
              Add Appointment
            </ListItemText>
          </Button>
        </Link>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">No Appointment found!</Alert>
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
              {/* <TableCell align="center">
                <Typography variant="h5" color="green">
                  Email
                </Typography>
              </TableCell> */}
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Date
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Time
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Amount
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Payment Method
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h5" color="green">
                  Payment Status
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
                {/* <TableCell style={{ width: 100 }} align="center">
                  {row.email}
                </TableCell> */}
                <TableCell
                  style={{ width: 160 }}
                  align="center"
                  sx={{ fontSize: "12.5px" }}
                >
                  {row.date}
                </TableCell>
                <TableCell
                  style={{ width: 160 }}
                  align="center"
                  sx={{ fontSize: "12.5px" }}
                >
                  {row.time}
                </TableCell>
                <TableCell
                  style={{ width: 100 }}
                  align="center"
                  sx={{ fontSize: "13px" }}
                >
                  {row.status}
                </TableCell>
                <TableCell
                  style={{ width: 130 }}
                  align="center"
                  sx={{ fontSize: "13px" }}
                >
                  {row.amount}
                </TableCell>
                <TableCell
                  style={{ width: 100 }}
                  align="center"
                  sx={{ fontSize: "13px" }}
                >
                  {row.paymentMethod}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {row.paymentStatus === "Pending" &&
                  row.paymentMethod === "Card" ? (
                    <Button
                      size="small"
                      onClick={() => paymentHandler(row)}
                    >
                      Pay now
                    </Button>
                  ) : (
                    row.paymentStatus
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
