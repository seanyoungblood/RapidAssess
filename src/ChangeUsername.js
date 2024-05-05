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

function getToken() {
    return sessionStorage.getItem('userToken');
}

const ChangeUsername = () => {
    const [usernameForm, setUsernameForm] = useState({
        curUsername:"",
        newUsername:"",
        confNewUsername:""
    })

    function handleUsernameTyping(event) {
        const {value, name} = event.target
        setUsernameForm(prevNote => ({
            ...prevNote, [name]: value})
    )
    }
    function ChangeMyUsername(event) {
        if (usernameForm.newUsername !== usernameForm.confNewUsername) {
            alert("Usernames do not match");
        }
        else {
            axios({
                method:"POST",
                url:"/edituser",
                headers:{
                    "Authorization": `Bearer ${getToken()}`
                },
                data:{
                    "update":"username",
                    "username": usernameForm.confNewUsername
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
            setUsernameForm(({
                curUsername:"",
                newUsername:"",
                confNewUsername:""
            }))
            event.preventDefault()
        }
    }

    return (
        <>
            <Box className="max-w-[512px] m-3 p-3">
                    <Typography variant="h5">
                        Change username
                    </Typography>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="curUsername"
                        label="Current username"
                        type="text"
                        name="curUsername"
                        value={usernameForm.curUsername}
                        onChange={handleUsernameTyping}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="newUsername"
                        label="New username"
                        type="text"
                        name="newUsername"
                        value={usernameForm.newUsername}
                        onChange={handleUsernameTyping}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="confNewUsername"
                        label="Confirm new username"
                        type="text"
                        name="confNewUsername"
                        value={usernameForm.confNewUsername}
                        onChange={handleUsernameTyping}
                        autoFocus
                    />
                    <Button
                        sx={{
                        backgroundColor: "#4E0506!important",
                        color: "white!important",
                        "&:hover": {
                            backgroundColor: "#440000!important",
                            },
                        }}
                        onClick={ChangeMyUsername}
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

export default ChangeUsername;
