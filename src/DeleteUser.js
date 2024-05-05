import React from 'react';
import { useState } from "react";
import axios from "axios";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function getToken() {
    return sessionStorage.getItem('userToken');
}


function deleteMe() {
    axios({
            method:"POST",
            url:"/deleteuser",
            headers:{
                "Authorization": `Bearer ${getToken()}`,
            }
        })
        .then((response) => {{
                console.log(response.msg);
                console.log(response.data);
                sessionStorage.clear();
                window.location.href="/login";
            }

        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
}

const DeleteUser = () => {
     const [open, setOpen] = React.useState(false);
     const handleOpen = () => setOpen(true);
     const handleClose = () => setOpen(false);
     return (
        <>
            <Button
                onClick={handleOpen}
                variant="contained"
                sx={{
                    backgroundColor: "#4E0506!important",
                    color: "white!important",
                        "&:hover": {
                            backgroundColor: "#440000!important",
                        },
                    }}>
                {"Delete account"}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to delete your account?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Doing so will make your user data unrecoverable.
                    </Typography>
                    <Button
                        onClick={deleteMe}
                        variant="contained"
                        sx={{
                            backgroundColor: "#4E0506!important",
                            color: "white!important",
                            "&:hover": {
                                backgroundColor: "#440000!important",
                            },
                        }}>
                            {"Delete"}
                        </Button>
                </Box>
            </Modal>
        </>)
}

export default DeleteUser;
