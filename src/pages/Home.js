import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  Link as RouterLink,
  Grid,
  Avatar,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import LogoImage from "../images/logo.png";
import "../css/home.css";
import { storage, firestore } from "../firebase";
import { ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

function HomeTop() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar src={LogoImage} alt="Logo" sx={{ marginRight: "10px" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BookSwap
        </Typography>
        <Button color="inherit" component={RouterLink} to="/browse">
          Browse
        </Button>
        <Button color="inherit" component={RouterLink} to="/categories">
          Categories
        </Button>
        <Button color="inherit" component={RouterLink} to="/profile">
          My Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function HomeContent() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <div className="home-content">
      {/* Search bar */}
      <TextField label="Search" variant="outlined" fullWidth style={{ marginBottom: "20px" }} />

      {/* Grid container */}
      <Grid container spacing={2}>
        {/* Grid item */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          {/* Card container */}
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/200" // Replace with your image URL
              alt="Placeholder"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Title
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Repeat grid items as needed */}
      </Grid>

      {/* Upload button */}
      <Button
        variant="contained"
        color="primary"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999, // Ensure the button is above other elements
        }}
        onClick={handleOpen}
      >
        Upload
      </Button>

      {/* Upload dialog */}
      <UploadDialog open={open} handleClose={handleClose} />
    </div>
  );
}

function UploadDialog({ open, handleClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");

  const handleFileChange = (files) => {
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    try {
      // Upload image file to Firebase Storage
      console.log(storage);
      const storageRef = ref(storage, selectedFile.name);
      const metadata = {
        contentType: 'image/jpeg',
        title,
        description,
        note,
        createdAt: new Date(),
      };
      
      // Upload the file and metadata
      const uploadTask = uploadBytes(storageRef, selectedFile, metadata);
      await uploadTask;
      // Get download URL of the uploaded image
      const downloadURL = await getDownloadURL(ref(storage, selectedFile.name));

      // Store metadata in Firestore
      //https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
    //   await firestore.collection("uploads").add({
    //     title,
    //     description,
    //     note,
    //     imageURL: downloadURL,
    //     createdAt: new Date(),
    //   });

      // Reset form fields and close dialog
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setNote("");
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        {/* File input with drag and drop feature */}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="file-input"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <label htmlFor="file-input">
          <Typography variant="body1" component="span" color="primary">
            Click to select image
          </Typography>
        </label>

        {/* Display selected file name */}
        {selectedFile && (
          <Typography variant="body2" color="text.secondary">
            Selected file: {selectedFile.name}
          </Typography>
        )}

        <TextField label="Title" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Note (Optional)"
          fullWidth
          margin="normal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFileUpload} color="primary" variant="contained">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { HomeTop, HomeContent };
