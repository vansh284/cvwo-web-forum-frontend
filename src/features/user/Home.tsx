import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  userErrorNoted,
  getUser,
  login,
  register,
  userStatusCreateNoted,
} from "./userSlice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import logo from "../../assets/logo.svg";

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const statusLog: string = useAppSelector((state) => state.user.statusLog);
  const statusCreate: string = useAppSelector(
    (state) => state.user.statusCreate
  );

  useEffect(() => {
    dispatch(getUser());
  }, []);
  useEffect(() => {
    if (statusLog === "logged in") {
      navigate("/threads", { replace: true });
    }
  }, [statusLog]);
  useEffect(() => {
    if (statusCreate === "success") {
      setSnackbarOpen(true);
      setCurrentTab(0);
      dispatch(userStatusCreateNoted());
    }
  }, [statusCreate]);

  return (
    <Grid>
      <Paper
        elevation={10}
        className="Paper"
        sx={{
          padding: "40px",
          width: "520px",
          height: "700px",
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <h2 style={{fontWeight:"700"}}>Welcome to the Web Forum!</h2>
        <Tabs
          value={currentTab}
          onChange={(_: React.SyntheticEvent, newTab: number) =>
            setCurrentTab(newTab)
          }
          centered
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {currentTab === 0 && <Login />}
        {currentTab === 1 && <Register />}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success">
          Account Registered!
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
}

function Login() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const statusLog: string = useAppSelector((state) => state.user.statusLog);
  const errorLog: string | null = useAppSelector((state) => state.user.error);
  return (
    <Stack spacing={2}>
      <img
        style={{ display: "block", marginLeft: "auto", marginRight: "auto", marginTop:"20px" }}
        height="130px"
        width="150px"
        src={logo}
        alt="logo"
      />
      <h2 style={{ fontWeight: "bold" }}>Login</h2>
      <TextField
        label="Username"
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          setUsername(e.target.value);
          if (errorLog !== null) {
            dispatch(userErrorNoted());
          }
        }}
        value={username}
        required
        fullWidth
        error={errorLog != null}
        disabled={statusLog === "pending"}
      />
      <TextField
        label="Password"
        type="password"
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          setPassword(e.target.value);
          if (errorLog !== null) {
            dispatch(userErrorNoted());
          }
        }}
        value={password}
        required
        fullWidth
        error={errorLog !== null}
        helperText={
          errorLog !== null
            ? "The username or password you entered is incorrect"
            : null
        }
        disabled={statusLog === "pending"}
      />
      <Button
        variant="contained"
        onClick={() =>
          dispatch(login({ username: username, password: password }))
        }
        disabled={
          statusLog === "pending" ||
          username.length === 0 ||
          password.length === 0
        }
        fullWidth
      >
        Login
      </Button>
    </Stack>
  );
}

function Register() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const statusCreate: string = useAppSelector(
    (state) => state.user.statusCreate
  );
  const errorCreate: string | null = useAppSelector(
    (state) => state.user.error
  );
  return (
    <Stack spacing={2}>
      <img
        style={{ display: "block", marginLeft: "auto", marginRight: "auto", marginTop:"20px" }}
        height="130px"
        width="150px"
        src={logo}
        alt="logo"
      />
      <h2 style={{ fontWeight: "bold" }}>Register</h2>
      <TextField
        label="Username"
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          setUsername(e.target.value);
          if (usernameError) {
            setUsernameError(false);
          }
          if (errorCreate) {
            dispatch(userErrorNoted());
          }
        }}
        value={username}
        required
        fullWidth
        error={usernameError || errorCreate !== null}
        helperText={
          usernameError
            ? "Username must be at least 5 characters"
            : errorCreate !== null
            ? "Username is already in use"
            : null
        }
        disabled={statusCreate === "pending"}
      />
      <TextField
        label="Password"
        type="password"
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          setPassword(e.target.value);
          if (passwordError) {
            setPasswordError(false);
          }
          if (confirmPasswordError) {
            setConfirmPasswordError(false);
          }
        }}
        value={password}
        required
        fullWidth
        error={passwordError || confirmPasswordError}
        helperText={
          passwordError ? "Password must be at least 8 characters" : null
        }
        disabled={statusCreate === "pending"}
      />
      <TextField
        label="Confirm Password"
        type="password"
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          setConfirmPassword(e.target.value);
          if (confirmPasswordError) {
            setConfirmPasswordError(false);
          }
        }}
        value={confirmPassword}
        required
        fullWidth
        error={confirmPasswordError}
        helperText={confirmPasswordError ? "Passwords do not match" : null}
        disabled={statusCreate === "pending"}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (username.length < 5) {
            setUsernameError(true);
          }
          if (password.length < 8) {
            setPasswordError(true);
          }
          if (confirmPassword !== password) {
            setConfirmPasswordError(true);
          }
          if (
            username.length >= 5 &&
            password.length >= 8 &&
            confirmPassword === password
          ) {
            dispatch(register({ username: username, password: password }));
          }
        }}
        disabled={
          statusCreate === "pending" ||
          username.length === 0 ||
          password.length === 0 ||
          confirmPassword.length === 0
        }
        fullWidth
      >
        Register
      </Button>
    </Stack>
  );
}
