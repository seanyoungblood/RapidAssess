import axios from "axios";
import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function SignUp(props) {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [hint, setHint] = useState({
    hintMessage:"",
    showHint: false,
  })
  const [password, setPassword] = useState("")
  const passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  hint.hintMessage = "A strong password must include lower and upper case characters, at least one special character, at least one number, and be at least 8 characters long";

  function signMeUp(event) {
    axios({
      method: "POST",
      url: "/adduser",
      data: {
        name: registerForm.name,
        username: registerForm.username,
        password: registerForm.password,
      },
    })
    .then((response) => {
      sessionStorage.setItem("userToken", response.data["user_token"]);
      sessionStorage.setItem("userId", response.data["user_id"]);
      console.log(response.user_token);
      console.log(response.data);
      window.location.href = "/home";
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });

    setRegisterForm({
      name: "",
      username: "",
      password: "",
    });
    event.preventDefault();
  }


  const handleChange = (name, value) => {
    setRegisterForm({...registerForm, [name]:value,});
  }

  const validateAndSignUp = (event) => {
    event.preventDefault();
    handleChange(event);

    if (!registerForm.username) {
      alert("Username field cannot be empty!")
    }
    if (!registerForm.name) {
      alert("Name field cannot be empty!")
    }
    if (!registerForm.password.match(passwordPattern)) {
      alert("Password does not follow criteria!")
      hint.showHint = true
      return
    }
    else {
      signMeUp(event);
    }

    setRegisterForm((prevState) => ({
      ...prevState,
      successMsg: "Validation Success",
    }));
  }

  const SignupStyle = {
    transform: "translate(0, -50%)",
    position: "absolute",
    top: '50%',
    height: "auto",
  };


  return (
    <>
    <div className="bg-lightgray h-screen w-screen m-0 p-5 overflow-auto flex justify-center">
    <Box sx={SignupStyle} className="bg-white max-w-[512px] m-3 p-3 shadow-lg">
    <Typography variant="h5">
    Register
    </Typography>
    <TextField
    margin="normal"
    onChange={({ target }) => {handleChange(target.name, target.value);}}
    required
    fullWidth
    id="name"
    label="Name"
    type="text"
    text={registerForm.name}
    name="name"
    value={registerForm.name}
    autoFocus
    />
    <TextField
    margin="normal"
    onChange={({ target }) => {handleChange(target.name, target.value);}}
    required
    fullWidth
    id="username"
    label="Username"
    autoComplete="username"
    type="text"
    text={registerForm.username}
    name="username"
    value={registerForm.username}
    autoFocus
    />
    <TextField
    margin="normal"
    onChange={({ target }) => {handleChange(target.name, target.value);}}
    required
    fullWidth
    id="password"
    label="Password"
    type="password"
    text={registerForm.password}
    name="password"
    value={registerForm.password}
    autoFocus
    />
    {hint.showHint && <Typography variant="subtitle2" className="p-5">{hint.hintMessage}</Typography>}
    <Button
    onClick={validateAndSignUp}
    type="Submit"
    fullWidth
    variant="contained"

    sx={{
      backgroundColor: "#4E0506!important",
      color: "white!important",
      "&:hover": {
        backgroundColor: "#440000!important",
      },
    }}
    >
    Register
    </Button>
    <Grid container className="justify-center">
    <Grid item>
    <Link to="/" className="text-blue-700">
    {"Already have an account? Login"}
    </Link>
    </Grid>
    </Grid>
    </Box>
    </div>
    </>
  );
}

export default SignUp;
