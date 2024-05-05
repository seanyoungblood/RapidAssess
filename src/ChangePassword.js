import React from 'react';
import { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

function getToken() {
    return sessionStorage.getItem('userToken');
}

const ChangePassword = () => {
    const [passwordForm, setPasswordForm] = useState({
        curPassword:"",
        newPassword:"",
        confNewPassword:""
    });
    const [hint, setHint] = useState({
      hintMessage:"",
      showHint: false,
    })
    const [password, setPassword] = useState("")
    const passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
    hint.hintMessage = "A strong password must include lower and upper case characters, at least one special character, at least one number, and be at least 8 characters long";

    const handleChange = (name, value) => {
        setPasswordForm({...passwordForm, [name]:value,});
    }

    const validateAndChange = (event) => {
        event.preventDefault();
        handleChange(event);

        if (passwordForm.newPassword !== passwordForm.confNewPassword) {
            alert("Passwords do not match!")
            return
        }
        if (!passwordForm.newPassword.match(passwordPattern)) {
            alert("Password does not follow criteria!")
            hint.showHint = true;
            return
        }
        else {
            ChangeMyPassword(event);
        }

        setPasswordForm((prevState) => ({
            ...prevState,
            successMsg: "Validation Success",
        }));
    }


  function ChangeMyPassword(event) {
            axios({
                    method:"POST",
                    url:"/edituser",
                    headers:{
                        "Authorization": `Bearer ${getToken()}`
                    },
                    data:{
                        "update":"password",
                        "password": passwordForm.confNewPassword
                    }
                    })
                    .then((response) => {{
                            console.log(response.data);
                        }

                    }).catch((error) => {
                        if (error.response) {
                            console.log(error.response)
                            console.log(error.response.status)
                            console.log(error.response.headers)
                        }
                    })
                    setPasswordForm(({
                        curPassword:"",
                        newPassword:"",
                        confNewPassword:""
                    }))
                    event.preventDefault();
    }



    return (
        <>
            <Box className="max-w-[512px] m-3 p-3">
                    <Typography variant="h5">
                        Change password
                    </Typography>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="curPassword"
                        label="Current password"
                        type="password"
                        name="curPassword"
                        value={passwordForm.curPassword}
                        onChange={({ target }) => {handleChange(target.name, target.value);}}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="newPassword"
                        label="New password"
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={({ target }) => {handleChange(target.name, target.value);}}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="confNewPassword"
                        label="Confirm new password"
                        type="password"
                        name="confNewPassword"
                        value={passwordForm.confNewPassword}
                        onChange={({ target }) => {handleChange(target.name, target.value);}}
                        autoFocus
                    />
                    {hint.showHint && <Typography variant="subtitle2" className="p-5">{hint.hintMessage}</Typography>}
                    <Button
                        sx={{
                        backgroundColor: "#4E0506!important",
                        color: "white!important",
                        "&:hover": {
                            backgroundColor: "#440000!important",
                            },
                        }}
                        onClick={validateAndChange}
                        type="Submit"
                        fullWidth
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </Box>
        </>
    )
}

export default ChangePassword;
