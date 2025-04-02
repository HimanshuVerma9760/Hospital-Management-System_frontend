import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  useTheme,
  Grid2,
} from "@mui/material";
import {
  People as PatientsIcon,
  MedicalServices as DoctorsIcon,
  CalendarMonth as AppointmentsIcon,
  AttachMoney as PaymentsIcon,
  Notifications as NotificationsIcon,
  LocalHospital as HospitalIcon,
  Payment,
  CurrencyRupee,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  provideGlobalGridOptions,
} from "ag-grid-community";
provideGlobalGridOptions({ theme: "legacy" });
import { Responsive, WidthProvider } from "react-grid-layout";
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { motion } from "motion/react";
const ResponsiveGridLayout = WidthProvider(Responsive);

const dummyData = {
  stats: [
    {
      title: "Total Patients",
      value: 1245,
      Icon: PatientsIcon,
      color: "primary.main",
    },
    {
      title: "Monthly Revenue",
      value: "Rs 52,420",
      Icon: CurrencyRupee,
      color: "error.main",
    },
    {
      title: "Active Doctors",
      value: 45,
      Icon: DoctorsIcon,
      color: "success.main",
    },
    {
      title: "Today's Appointments",
      value: 68,
      Icon: AppointmentsIcon,
      color: "warning.main",
    },
  ],
  appointments: [
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Smith",
      time: "09:00 AM",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Jane Smith",
      doctor: "Dr. Wilson",
      time: "10:30 AM",
      status: "Pending",
    },
  ],
  revenueData: [
    { month: "Jan", revenue: 4000, appointments: 240 },
    { month: "Feb", revenue: 3000, appointments: 139 },
    { month: "March", revenue: 2000, appointments: 110 },
    { month: "April", revenue: 3500, appointments: 200 },
    { month: "May", revenue: 4600, appointments: 250 },
    { month: "June", revenue: 3430, appointments: 197 },
    { month: "July", revenue: 5670, appointments: 595 },
  ],
  doctors: [
    { id: 1, name: "Dr. Smith", specialization: "Cardiology", available: true },
    {
      id: 2,
      name: "Dr. Wilson",
      specialization: "Neurology",
      available: false,
    },
  ],
  notifications: [
    { id: 1, message: "Emergency case in ICU", type: "critical" },
    { id: 2, message: "Dr. Smith’s appointment at 10 AM", type: "reminder" },
  ],
};

export default function Dashboard() {
  const theme = useTheme();
  //   const [draggingItem, setDraggingItem] = useState(null);

  return (
    <>
      <Grid2 display="flex" justifyContent="center">
        {"Dashboard".split("").map((eachWord, index) => {
          return (
            <motion.h1
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: index * 0.1 },
              }}
              transition={{ delay: 1 }}
              key={index}
            >
              {eachWord}
            </motion.h1>
          );
        })}
      </Grid2>
      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        <ResponsiveGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          autoSize
          draggableHandle=".drag-handle"
        >
          {dummyData.stats.map((stat, index) => (
            <div
              key={`stat-${index}`}
              data-grid={{
                x: index % 2 === 0 ? 0 : index * 3,
                y: 0,
                w: 3,
                h: index % 3 === 0 ? 1 : 2,
              }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderLeft: `4px solid ${
                    theme.palette[stat.color.split(".")[0]][
                      stat.color.split(".")[1]
                    ]
                  }`,
                  height: "100%",
                }}
                className="drag-handle"
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <stat.Icon sx={{ fontSize: 40, color: stat.color }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                </Box>
              </Paper>
            </div>
          ))}

          <div key="chart1" data-grid={{ x: 0, y: 2, w: 8, h: 4 }}>
            <Paper
              sx={{
                paddingTop: "1.5rem",
                paddingLeft: "1.5rem",
                paddingBottom: "4rem",
                paddingRight: "2rem",
                height: "100%",
              }}
              className=".drag-handle"
            >
              <Typography
                variant="h6"
                className="drag-handle"
                sx={{ paddingBottom: "1rem" }}
              >
                Appointments & Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    dataKey="appointments"
                    stroke={theme.palette.success.main}
                  />
                  <Line dataKey="revenue" stroke={theme.palette.primary.main} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </div>

          <div
            key="notifications"
            className="drag-handle"
            data-grid={{ x: 8, y: 2, w: 4, h: 2 }}
          >
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6">Notifications</Typography>
              <List>
                {dummyData.notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <Avatar
                      sx={{
                        bgcolor:
                          notification.type === "critical"
                            ? "error.main"
                            : "info.main",
                        marginRight: "1rem",
                      }}
                    >
                      <NotificationsIcon />
                    </Avatar>
                    <ListItemText primary={notification.message} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>

          <div
            key="appointments"
            className="drag-handle"
            data-grid={{ x: 8, y: 4, w: 4, h: 2.5 }}
          >
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6">Recent Appointments</Typography>
              <div
                className="ag-theme-quartz"
                style={{ height: "100%", width: "100%" }}
              >
                <AgGridReact
                  rowData={dummyData.appointments}
                  columnDefs={[
                    { field: "patient", headerName: "Patient" },
                    { field: "doctor", headerName: "Doctor" },
                    { field: "time", headerName: "Time" },
                    {
                      field: "status",
                      headerName: "Status",
                      cellStyle: (params) => ({
                        color:
                          params.value === "Completed" ? "green" : "orange",
                      }),
                    },
                  ]}
                  domLayout="autoHeight"
                />
              </div>
            </Paper>
          </div>

          <div
            key="doctors"
            className="drag-handle"
            data-grid={{ x: 0, y: 6, w: 2, h: 4 }}
          >
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6">Doctor Availability</Typography>
              <List>
                {dummyData.doctors.map((doctor) => (
                  <ListItem key={doctor.id}>
                    <HospitalIcon
                      color={doctor.available ? "success" : "disabled"}
                      sx={{ marginRight: "1rem" }}
                    />
                    <ListItemText
                      primary={doctor.name}
                      secondary={doctor.specialization}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>
        </ResponsiveGridLayout>
      </Box>
    </>
  );
}
