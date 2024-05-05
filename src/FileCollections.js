import { Typography, Modal, Box} from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
function FileCollections({ open, onClose, onFileSelect }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
        const userId = sessionStorage.getItem("userId");
        if (open && userId) {
            try {
                const response = await axios.get(`/images/${userId}`);
                setFiles(response.data.images || []);
                console.log(files);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch images:", error);
                setFiles([]);
            }
        }
    };

    fetchImages();
}, [open]);

  const handleFileClick = (file) => {
    onFileSelect(file); 
    onClose();
    
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4,
        maxHeight: '300px', overflowY: 'auto'
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          File Names
        </Typography>
        <Box id="modal-modal-description" sx={{ mt: 2 }}>
         <div>
          {loading ? (
            <Typography>Loading files...</Typography>
          ) : (
             files.map((file, index) => (
            <Typography key={index} onClick={() => handleFileClick(file)} style={{ cursor: 'pointer' }}>
            {file.fileName}
            </Typography>
          ))
        )}
        </div>
        </Box>
      </Box>
    </Modal>
  );
}

export default FileCollections;
