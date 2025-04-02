import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Grid2,
  LinearProgress,
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
import { indigo } from "@mui/material/colors";
const Conn = import.meta.env.VITE_CONN_URI;

import ViewForm from "./ViewForm";
import ModalContent from "../../../Modal/ModalContent";
import { Edit, InfoOutlined } from "@mui/icons-material";
export default function Forms() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewFormMode, setViewFormMode] = useState(false);
  const [showPrompt, setShowPrompt] = useState({
    state: false,
    type: "",
  });

  function onCloseHandler() {
    setShowPrompt(false);
    getForms();
  }

  async function getForms() {
    const response = await fetch(
      `${Conn}/form/get-all/?page=${page + 1}&limit=${rowsPerPage}`,
      {
        method: "get",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response) {
      if (response.ok) {
        const result = await response.json();
        setForms(result.result);
        setTotalCount(result.totalRecords);
      }
      setIsLoading(false);
    }
  }

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

  function createData(inputId, id, title, description, createdAt) {
    return { inputId, id, title, description, createdAt };
  }

  const rows = forms.map((eachForm) =>
    createData(
      eachForm.id,
      eachForm.form.id,
      eachForm.form.title,
      eachForm.form.description,
      eachForm.form.createdAt
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
    localStorage.removeItem("title");
    localStorage.removeItem("description");
  }, []);
  useEffect(() => {
    getForms();
  }, [page, rowsPerPage]);
  const reqFormId = React.useRef();
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
  if (viewFormMode) {
    return (
      <ViewForm
        forms={forms.filter((eachForm) => eachForm.id === reqFormId.current)}
        toggleViewMode={setViewFormMode}
      />
    );
  }
  if (showPrompt.state) {
    if (showPrompt.type === "newForm") {
      return (
        <ModalContent
          isOpen={showPrompt}
          type="form"
          onClose={onCloseHandler}
          message={{
            message: "Add Form",
            caption: "Title and description are needed to continue.",
          }}
        />
      );
    } else if (showPrompt.type === "editForm") {
      return (
        <ModalContent
          isOpen={showPrompt}
          type={showPrompt.type}
          metaData={{ id: reqFormId.current }}
          onClose={onCloseHandler}
          message={{
            message: "Edit Information",
            caption: "Edit information you want to change",
          }}
        />
      );
    }
  }
  return (
    <>
      <Grid2>
        <Typography variant="h4" fontWeight="bold" align="center">
          Forms Management
        </Typography>
        <Grid2 display="flex" justifyContent="right" marginBottom="0.5rem">
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              setShowPrompt((prevState) => ({
                ...prevState,
                state: true,
                type: "newForm",
              }))
            }
            sx={{ backgroundColor: indigo[300] }}
          >
            Add Form
          </Button>
        </Grid2>
      </Grid2>
      {rows.length === 0 && (
        <Alert severity="info">No Forms found, click Add Forms to add </Alert>
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
                  Title
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Description
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem" }}
                  color="black"
                >
                  Created On
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
                <TableCell style={{ width: 150 }}>{row.title}</TableCell>
                <TableCell style={{ width: 200 }} align="center">
                  {row.description}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.createdAt.split("T")[0]}
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
                        onClick={() => {
                          reqFormId.current = row.id;
                          setShowPrompt((prevState) => ({
                            ...prevState,
                            state: true,
                            type: "editForm",
                          }));
                        }}
                        sx={{ color: indigo[300] }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Preview">
                      <IconButton
                        onClick={() => {
                          reqFormId.current = row.inputId;
                          setViewFormMode(true);
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
                colSpan={3}
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
