import { useState, useEffect, useRef } from "react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import { Button, Modal, Box } from "@mui/material";
import { TextField } from "@mui/material";

import Card from "@mui/material/Card";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";
import Fab from "@mui/material/Fab";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import IconButton from "@mui/material/IconButton";
import CollectionsIcon from "@mui/icons-material/Collections";
import SettingsIcon from "@mui/icons-material/Settings";
import PinDropIcon from "@mui/icons-material/PinDrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./output.css";
import FileCollections from "./FileCollections";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
};

export const ImageUpload = ({ onClose, onImageSave }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [result, setResult] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [rescueX, setRescueX] = useState(undefined);
  const [rescueY, setRescueY] = useState(undefined);
  const [threshold, setThreshold] = useState(10);
  const [greenPinMode, setGreenPinMode] = useState(false);
  const [redPinMode, setRedPinMode] = useState(false);
  const [yellowPinMode, setYellowPinMode] = useState(false);
  const [greenPin, setGreenPin] = useState(null);
  const [yellowPin, setYellowPin] = useState(null);
  const [redPin, setRedPin] = useState(null);
  const [advancedSettingsVisible, setAdvancedSettingsVisible] = useState(false);
  const [locationTitle, setLocationTitle] = useState("");
  const userToken = sessionStorage.getItem("userId");
  const imgRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const canvasRef = useRef(null);
  

  const [isClearFormVisible, setIsClearFormVisible] = useState(false);
  const [clearOptions, setClearOptions] = useState({
    greenPin: false,
    yellowPin: false,
    redPin: false,
    allPins: false,
    image: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [prevFile,setPrevFile]= useState(false)
  const [clickFile,setClickFile]=useState();

  const handleFileSelect = async (image) => {
    try {
     
      const dataUri = `data:image/jpeg;base64,${image.data}`;
  
      const response = await fetch(dataUri);
      const blob = await response.blob();
  
      const file = new File([blob], image.fileName, { type: blob.type });
      
      setSelectedFile(file); 
      setPrevFile(true);
      setClickFile(image);
      setImage(true);
      
    } catch (error) {
      console.error('Error converting Base64 to File:', error);
    }
  };
  
 

  const CustomNumberInput = ({ value, onChange, min = 0, max = 256 }) => {
    const [localValue, setLocalValue] = useState(value.toString());

    useEffect(() => {
      setLocalValue(value.toString());
    }, [value]);

    const handleIncrement = () => onChange(Math.min(value + 1, max));
    const handleDecrement = () => onChange(Math.max(value - 1, min));

    const handleLocalChange = (event) => {
      const newValue = event.target.value;
      setLocalValue(newValue);
    };

    const handleBlur = () => {
      const newValue = Math.max(min, Math.min(max, Number(localValue)));
      onChange(newValue);
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          variant="outlined"
          value={localValue}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          type="number"
          sx={{ mx: 1, width: "80px" }}
          InputProps={{ inputProps: { min, max } }}
        />
      </Box>
    );
  };

  const handleClearOptionChange = (event) => {
    const { name, checked } = event.target;
    if (name === "allPins") {
      setClearOptions({
        greenPin: checked,
        yellowPin: checked,
        redPin: checked,
        allPins: checked,
        image: clearOptions.image,
      });
    } else {
      setClearOptions({
        ...clearOptions,
        [name]: checked,
      });
    }
  };

  const handleClearFormSubmit = (event) => {
    event.preventDefault();
    if (clearOptions.image) {
      clearData();
      //setSelectedFile(undefined);
      //setImage(false);
      //setData(undefined);
      //setPreview(null);
      //setGreenPin(null);
      //setYellowPin(null);
      //setRedPin(null);
      //setGreenPinMode(false);
      //setRedPinMode(false);
      //  setYellowPinMode(false);
      //  clearData();
      //  console.log(data)
    } else {
      if (clearOptions.greenPin) setGreenPin(null);
      if (clearOptions.yellowPin) setYellowPin(null);
      if (clearOptions.redPin) setRedPin(null);
    }
    setIsClearFormVisible(false);
    setClearOptions({
      greenPin: false,
      yellowPin: false,
      redPin: false,
      allPins: false,
      image: false,
    });
  };

  const closeModal = () => setIsClearFormVisible(false);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg"],
    },
  });

  //const sendFile = async () => {
  //  console.log(startX + startY + endX + endY);
  //  if (image) {
  //    let formData = new FormData();
  //    formData.append("file", selectedFile);
  //    formData.append("startX", startX || 0);
  //    formData.append("startY", startY || 0);
  //    formData.append("endX", endX || 0);
  //    formData.append("endY", endY || 0);
  //    formData.append("threshold", threshold);
  //    let res = await axios({
  //      method: "post",
  //      url: "http://127.0.0.1:5000/predict",
  //      data: formData,
  //      responseType: "blob",
  //    });

  //    var url = URL.createObjectURL(res.data);
  //    setResult(url);

  //    setStartX(0);
  //    setStartY(0);
  //    setEndX(0);
  //    setEndY(0);
  //  }
  //};
  const sendFile = async () => {
    console.log(startX, startY, endX, endY);

    if (!imgRef.current) {
      console.error("No image to send");
      return;
    }

    if (!greenPin || !redPin) {
      alert(
        "Please place at least start pin and an end pin before submitting.",
      );
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 256;

    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        let formData = new FormData();
        formData.append("file", blob, "image.jpeg");
        setIsloading(true);
        formData.append("startX", startX || 0);
        formData.append("startY", startY || 0);
        formData.append("endX", endX || 0);
        formData.append("endY", endY || 0);
        formData.append("middleX", rescueX);
        formData.append("middleY", rescueY);
        formData.append("threshold", threshold);

        try {
          let res = await axios({
            method: "post",
            url: "http://127.0.0.1:5000/predict",
            data: formData,
            responseType: "blob",
          });

          var url = URL.createObjectURL(res.data);
          setPreview(url);
          setResult(url);
        } catch (error) {
          console.error("Error processing the image: ", error);
        } finally {
          setIsloading(false);
        }
      },
      "image/jpeg",
      0.95,
    );
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setGreenPin(null);
    setYellowPin(null);
    setRedPin(null);
    setGreenPinMode(false);
    setRedPinMode(false);
    setYellowPinMode(false);
  };

  const handleImageClick = (event) => {
    const imgElement = imgRef.current;
    const rect = imgElement.getBoundingClientRect();

    const scaleX = imgElement.naturalWidth / rect.width; 
    const scaleY = imgElement.naturalHeight / rect.height;
    const clickedX = event.clientX - rect.left;
    const clickedY = rect.bottom - event.clientY;

    const boundingBox = event.currentTarget.getBoundingClientRect();
    let imageclickedX = event.clientX - boundingBox.left;
    let imageclickedY = boundingBox.bottom - event.clientY;

    const adjustedX = clickedX * scaleX;
    const adjustedY = clickedY * scaleY;

    console.log(clickedX);
    console.log(clickedY);

    if (greenPinMode) {
      setStartX(adjustedX);
      setStartY(adjustedY);
      setGreenPin({ x: imageclickedX, y: imageclickedY, color: "#27FF00" });
      setGreenPinMode(false);
    } else if (yellowPinMode) {
      setRescueX(adjustedX);
      setRescueY(adjustedY);
      setYellowPin({ x: imageclickedX, y: imageclickedY, color: "#FFFF00" });
      setYellowPinMode(false);
      setYellowPinMode(false);
    } else if (redPinMode) {
      setEndX(adjustedX);
      setEndY(adjustedY);
      setRedPin({ x: imageclickedX, y: imageclickedY, color: "#FF0000" });
      setRedPinMode(false);
    }
  };

  const handlePinMode = (color, pinSetter) => {
    setGreenPinMode(false);
    setRedPinMode(false);
    setYellowPinMode(false);

    pinSetter(null);

    switch (color) {
      case "green":
        setGreenPinMode(true);
        break;
      case "yellow":
        setYellowPinMode(true);
        break;
      case "red":
        setRedPinMode(true);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select an image to save.");
      return;
    }
    if (!locationTitle) {
      alert("Please enter a location title.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", locationTitle);
    formData.append("user_id", userToken);
    formData.append("fileName", selectedFile.name);

    try {
      if(!prevFile){
      const response = await axios({
        method: "post",
        url: "/image",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { imageID } = response.data;
      const aiResponse = await axios.post('/saveAI', {
        imageID: imageID, 
        user_id: userToken, 
        name : locationTitle
    });

    }else{
      const  imageID  = clickFile.imageID;
      const aiResponse = await axios.post('/saveAI', {
        imageID: imageID, 
        user_id: userToken, 
        name : locationTitle
    });


    }

    setClickFile({});
    setPrevFile(false);
    console.log('Image saved, calling onImageSave');
    onClose();
      
    } catch (error) {
      console.error("Error saving the image and location:", error);
      alert("Failed to save the image and location.");
    }
  };

  const toggleAdvancedSettings = () => {
    setAdvancedSettingsVisible(!advancedSettingsVisible);
  };

  useEffect(() => {
    if (selectedFile) {
      
      const objectUrl = URL.createObjectURL(selectedFile);
      
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 256, 256);
        const resizedImageURL = canvas.toDataURL("image/jpeg");
        setPreview(resizedImageURL);
        console.log("preview");
        console.log(preview);
      };
      img.src = objectUrl;
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    // setIsloading(true);
    console.log(preview);
    // sendFile();
  }, [preview]);

  useEffect(() => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(acceptedFiles[0]);
    setData(undefined);
    setImage(true);
  }, [acceptedFiles]);

  return (
    <div className="min-h-auto text-white self-center content-center items-center p-5 bg-lightgray">
      <div
        className="self-center"
        {...getRootProps({ className: "dropzone" })}
      />
      <h1 className="text-maroonhover font-ubuntu text-2xl">
        <b>CREATE ROUTE</b>
      </h1>
      <div className="bg-white rounded p-6 m-3">
        <input
          type="text"
          placeholder="Enter Location Title"
          className="px-4 py-2 mt-3 border rounded focus:outline-none focus:border-black-500 text-black w-1/2"
          value={locationTitle}
          onChange={(e) => setLocationTitle(e.target.value)}
        />

        <div className="m-10 flex jusitfy-center items-center">
          {image ? (
            <div
              className="m-10 mt-1"
              style={{
                margin: "auto",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            > {isLoading && (<div style={{
              position: "absolute",
              zIndex: 20,
              top: "45%",
            }}> 
              <CircularProgress sx={{
                color: "white",
              }}></CircularProgress>
              </div>)
              }
              {preview && (
                <div
                  style={{
                    position: "relative",
                    width: "80vw",
                    height: "auto",
                    maxWidth: "512px",
                  }}
                  onClick={(event) => handleImageClick(event)}
                >
                  <img
                    src={preview}
                    ref={imgRef}
                    style={{
                      width: "256px", 
                      height: "256px", 
                      margin: "auto",
                    }}
                  />
                  {greenPin && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: greenPin.color,
                        position: "absolute",
                        bottom: greenPin.y,
                        left: greenPin.x,
                      }}
                    />
                  )}
                  {yellowPin && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: yellowPin.color,
                        position: "absolute",
                        bottom: yellowPin.y,
                        left: yellowPin.x,
                      }}
                    />
                  )}
                  {redPin && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: redPin.color,
                        position: "absolute",
                        bottom: redPin.y,
                        left: redPin.x,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Card
                style={{
                  minHeight: "15vh",
                  minWidth: "auto",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="mx-auto"
              >
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  {...getInputProps()}
                />
                <div className="flex justify-center items-center">
                  <div className="m-3">
                    <label htmlFor="contained-button-file">
                      <Fab className="m-3" component="span">
                        <AddPhotoAlternateIcon className="m-3" />
                      </Fab>
                    </label>
                  </div>
                  <div className="m-3">
                    <Fab className="m-3" component="span" onClick={handleOpenModal}>
                        <CollectionsIcon className="m-3" color="default"  />
                     </Fab>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <button
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 py-2 rounded m-2 flex items-center"
              onClick={() => handlePinMode("green", setGreenPin)}
              disabled={greenPinMode}
            >
              <PinDropIcon style={{ color: "white", marginRight: "8px" }} />
              Start
            </button>

            <button
              className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white px-4 py-2 rounded m-2 flex items-center"
              onClick={() => handlePinMode("yellow", setYellowPin)}
              disabled={yellowPinMode}
            >
              <PinDropIcon style={{ color: "white", marginRight: "8px" }} />
              Rescue
            </button>

            <button
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2 rounded m-2 flex items-center"
              onClick={() => handlePinMode("red", setRedPin)}
              disabled={redPinMode}
            >
              <PinDropIcon style={{ color: "white", marginRight: "8px" }} />
              End
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-5">
          <IconButton
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            onClick={toggleAdvancedSettings}
            aria-label="advanced settings"
          >
            <SettingsIcon />
          </IconButton>
        </div>
        <Modal
          open={advancedSettingsVisible}
          onClose={toggleAdvancedSettings}
          aria-labelledby="advanced-settings-title"
          aria-describedby="advanced-settings-description"
        >
          <Box sx={modalStyle}>
            <h2 id="advanced-settings-title">Advanced Settings</h2>
            <div className="text-black p-3 flex items-center">
              <h1 className="text-l font-bold "> Threshold </h1>
              <Tooltip
                title="Default is 10, set to lower value if roads aren't fully detected (or vice versa)"
                placement="top"
                arrow
              >
                <HelpOutlineIcon className="cursor-pointer" />
              </Tooltip>

              <div style={{ marginRight: "16px" }}>
                <CustomNumberInput
                  value={threshold}
                  onChange={setThreshold}
                  min={0}
                  max={256}
                />
              </div>
            </div>
            <div className="relative p-2">
              <div className="absolute right-0 top-0">
                <Button
                  className="flex justify-end"
                  sx={{ color: "#4E0506" }}
                  onClick={toggleAdvancedSettings}
                >
                  Close
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
      <div className="flex justify-end space-x-4 mt-5">
        <button
          className="bg-maroonbg hover:bg-maroonhover text-white py-2 px-4 rounded hover:border-red-800"
          onClick={sendFile}
        >
          Submit
        </button>
        <button
          className="bg-maroonbg hover:bg-maroonhover text-white py-2 px-4 rounded hover:border-red-800"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-maroonbg hover:bg-maroonhover text-white py-2 px-4 rounded hover:border-red-800"
          onClick={() => setIsClearFormVisible(true)}
        >
          Clear Options
        </button>
      </div>

      <Modal
        open={isClearFormVisible}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form onSubmit={handleClearFormSubmit}>
            <div>
              <h2>
                <b>What do you want to clear?</b>
              </h2>
              <input
                type="checkbox"
                id="greenPin"
                name="greenPin"
                checked={clearOptions.greenPin}
                onChange={handleClearOptionChange}
              />
              <label htmlFor="greenPin"> Start Pin</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="yellowPin"
                name="yellowPin"
                checked={clearOptions.yellowPin}
                onChange={handleClearOptionChange}
              />
              <label htmlFor="yellowPin"> Rescue Pin</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="redPin"
                name="redPin"
                checked={clearOptions.redPin}
                onChange={handleClearOptionChange}
              />
              <label htmlFor="redPin"> End Pin</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="image"
                name="image"
                checked={clearOptions.image}
                onChange={handleClearOptionChange}
              />
              <label htmlFor="image"> Image</label>
            </div>
            <div className="relative w-full p-2">
              <div className="absolute right-0 top-0">
                <Button
                  className="jusitfy-end"
                  sx={{ color: "#4E0506" }}
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  className="justify-end"
                  sx={{ color: "#4E0506" }}
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
      <FileCollections open={isModalOpen} onClose={handleCloseModal} onFileSelect={handleFileSelect} />
    </div>
  );
};
