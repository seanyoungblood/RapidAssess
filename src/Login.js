import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Login(props) {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  async function logMeIn(event) {
    axios({
      method: "POST",
      url: "/login",
      data: {
        username: loginForm.username,
        password: loginForm.password,
      },
    })
      .then((response) => {
        if (response.data["user_token"]) {
          sessionStorage.setItem("userToken", response.data["user_token"]);
          sessionStorage.setItem("userId", response.data["user_id"]);
          console.log(response.user_token);
          console.log(response.data);
          window.location.href = "/home";
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    setLoginForm({
      username: "",
      password: "",
    });

    event.preventDefault();
  }
  function handleChange(event) {
    const { value, name } = event.target;
    setLoginForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));


        setLoginForm(({
            username:"",
            password:""
        }))

        event.preventDefault()
    }
    function handleChange(event) {
        const {value, name} = event.target
        setLoginForm(prevNote => ({
            ...prevNote, [name]: value})
    )
    }

    const LoginStyle = {
        transform: "translate(0, -50%)",
        position: "absolute",
        top: '50%',
        height: "auto",
    };

      return (
          <>
            <div className="bg-lightgray h-screen w-screen m-0 p-5 overflow-auto flex justify-center">
                <Box sx={LoginStyle} className="bg-white max-w-[512px] m-3 p-3 shadow-lg ">
                    <Typography variant="h5">
                        Sign In
                    </Typography>
                    <TextField
                        margin="normal"
                        onChange={handleChange}
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        autoComplete="username"
                        type="text"
                        text={loginForm.username}
                        name="username"
                        value={loginForm.username}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        onChange={handleChange}
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        text={loginForm.password}
                        name="password"
                        value={loginForm.password}
                        autoFocus
                    />
                    <Button
                        margin="normal"
                        onClick={logMeIn}
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
                        Login
                    </Button>
                    <Grid container className="justify-center">
                        <Grid item>
                            <Link to="/signup" className="text-blue-700">
                                { "Don't have an account? Sign up" }
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </div>
          </>
    );
}

export default Login;
