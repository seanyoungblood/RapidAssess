import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Modal,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    TextField,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};

const loadingEmptyStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textTransform: "uppercase",
}

const ImagesDisplay = ({ onRefresh }) => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    const [editedName, setEditedName] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchImages = async () => {
        const userId = sessionStorage.getItem("userId");
        if (userId) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/listAI/${userId}`);
                setImages(response.data.images || []);
            } catch (error) {
                console.error("Failed to fetch images:", error);
                setImages([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log("No user ID found. Please login.");
        }
    };

    useEffect(() => {
        fetchImages();
    }, [onRefresh]);

    const handleOpen = (image) => {
        setSelectedImage(image);
        setEditedName(image.name);
        setOpen(true);
        setEditMode(false);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
        setEditMode(false);
    };

    const handleEdit = () => {
        setEditMode(true);
        setOpen(true);
        setAnchorEl(null);
    };

    const handleDelete = () => {
        const imageId = selectedImage.aiID;
        if (!imageId) {
            console.error("Error: imageId is undefined");
            return;
        }

        axios.delete(`/deleteAI/${imageId}`)
            .then((response) => {
                console.log("Delete response:", response.data);
                fetchImages();
            })
            .catch((error) => {
                console.error("Error deleting image:", error);
            });

        handleClose();
    };

    const handleMenuClick = (event, image) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedImage(image);
        setEditedName(image.name);
    };

    const handleSaveEdit = () => {
        const imageId = selectedImage.aiID;
        if (imageId && editedName) {
            axios.put(`/updateAI/${imageId}`, { name: editedName })
                .then((response) => {
                    console.log("Edit response:", response.data);
                    fetchImages();
                })
                .catch((error) => {
                    console.error("Error updating image:", error);
                });
        }
        handleClose();
    };

    return (
        <div className="h-full w-full bg-lightgray">
            {isLoading ? (
                <Typography sx={loadingEmptyStyle} variant="h5">Loading images...</Typography>
            ) : (
                images.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            maxWidth: '100%',
                            margin: 'auto',
                            overflowY: 'auto'
                        }}>
                        {images.map((image, index) => (
                            <div
                                key={index}
                                style={{
                                    margin: "12px",
                                    display: "inline-block",
                                    background: "white",
                                    borderRadius: "10px",
                                    width: "260px",
                                    height: "180px",
                                    textAlign: "center",
                                    position: "relative",
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        width: "260px",
                                        height: "180px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        borderColor: "#4E0506", 
                                        color: "#4E0506", 
                                        '&:hover': {
                                            borderColor: "#4E0506", 
                                        },
                                    }}
                                    onClick={() => handleOpen(image)}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            flexGrow: 1,
                                            marginLeft: "5px",
                                            textAlign: "left",
                                            color: "#4E0506",
                                            paddingBottom: "6px",
                                        }}
                                    >
                                        {image.name}
                                    </Typography>
                                    <img
                                        src={`data:image/jpeg;base64,${image.data}`}
                                        alt={image.name}
                                        style={{
                                            width: "auto",
                                            height: "120px",
                                            paddingBottom: "10px",
                                            objectFit: "contain",
                                        }}
                                    />
                                </Button>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={(event) => handleMenuClick(event, image)}
                                    size="small"
                                    style={{ position: "absolute", top: "5px", right: "5px", zIndex: 1 }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => handleEdit(selectedImage)}>Edit</MenuItem>
                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                </Menu>
                            </div>
                        ))}
                            {new Array(5 - images.length % 5).fill().map((_, idx) => (
                                <div key={`placeholder-${idx}`} style={{
                                    margin: "12px",
                                    width: "260px",
                                    height: "180px",
                                    visibility: 'hidden',
                                }} />
                            ))}
                    </div>
                ) : (
                    <Typography sx={loadingEmptyStyle} variant="h5">No images found</Typography>
                )
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            padding: '3px',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {editMode ? (
                        <>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Location Title"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                style={{ marginBottom: "20px" }}
                            />
                            <img
                                src={`data:image/jpeg;base64,${selectedImage.data}`}
                                alt={selectedImage.name}
                                style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "20px" }}
                            />
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleSaveEdit}
                                sx={{
                                    backgroundColor: "#4E0506!important",
                                    color: "white!important",
                                    "&:hover": {
                                        backgroundColor: "#440000!important",
                                    },
                                }}
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <h2 id="modal-modal-title" className="text-2xl text-center">{selectedImage.name}</h2>
                            <img
                                src={`data:image/jpeg;base64,${selectedImage.data}`}
                                alt={selectedImage.name}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    marginTop: "10px",
                                }}
                            />
                        </>
                    )}
                </Box>
            </Modal>

        </div>
    );
};

export default ImagesDisplay;

