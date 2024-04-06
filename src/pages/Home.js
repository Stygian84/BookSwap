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
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import LogoImage from "../images/logo.png";
import "../css/home.css";
import { storage, firestore } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, addDoc, collection, getDocs, query, where, orderBy, startAt,getDoc } from "firebase/firestore";
import bookCategories from "../utils/categories";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

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
  const [data, setData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // To Convert UID to username
  async function getUserData(uid) {
    const userDocRef = doc(collection(firestore, "users"), uid);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.exists() ? userDocSnapshot.data() : null;
  }
  // Initial Query Display
  const getAllImageURLs = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "images"));
      const imageData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userData = await getUserData(doc.data().uid);
          return {
            id: doc.id,
            userName: userData.name,
            ...doc.data(),
          };
        })
      );
      setData(imageData);
      return;
    } catch (error) {
      console.error("Error getting image URLs:", error);
      return;
    }
  };
  useEffect(() => {
    getAllImageURLs();
  }, []);
  console.log(data);

  // Search Function
  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchTerm.trim() == ""){
        getAllImageURLs();
    }
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      try {
        let searchResults = [];

        // [TODO] Logic title contains
        // const q = query(
        //   collection(firestore, "images"),
        //   where("title", "array-contains", searchTerm.trim().toLowerCase()),
        //   orderBy("title")
        // );
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   searchResults.push({ id: doc.id, ...doc.data() });
        // });
        // setData(searchResults);

        // Logic to search only from start letter n subsequent
        const q = query(
          collection(firestore, "images"),
          where("title", ">=", searchTerm.trim()),
          orderBy("title"),
          startAt(searchTerm.trim()),
        );
        const querySnapshot = await getDocs(q);
        searchResults = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userData = await getUserData(doc.data().uid);
            const data = doc.data();
            if (data.title.startsWith(searchTerm.trim())) {
              return {
                id: doc.id,
                userName: userData.name,
                ...data,
              };
            }
            return null;
          })
        );
        setData(searchResults.filter((result) => result !== null));
      } catch (error) {
        console.error("Error searching images:", error);
      }
    }
  };
  useEffect(() => {}, [data]);
  return (
    <div className="home-content">
      {/* Search bar */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        style={{ marginBottom: "20px" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />

      {/* Grid container */}
      <Grid container spacing={2}>
        {/* Map data to grid items */}
        {data.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            {/* Card container */}
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={item.imageURL} // Use item's imageURL property as the image URL
                alt={item.title} // Use item's title as the alt text for the image
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Chip
                  label={item.category}
                  color="primary"
                  sx={{
                    "&:hover": {
                      bgcolor: "secondary.main",
                      color: "primary.contrastText",
                    },
                    cursor: "pointer",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
  const [uid, setUid] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);
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

    if (!title.trim() || !description.trim()) {
      console.log("Title and description are required");
      return;
    }
    if (!category) {
      setCategoryError("Please select a category");
      return;
    }
    try {
      // Upload image file to Firebase Storage
      console.log(storage);
      const storageRef = ref(storage, selectedFile.name);
      const metadata = {
        contentType: "image/jpeg",
        customMetadata: {
          title: title,
          description: description,
          note: note,
          category: category,
          uid: uid,
          createdAt: new Date().toString(),
        },
      };

      const uploadTask = uploadBytes(storageRef, selectedFile, metadata);
      await uploadTask;
      const downloadURL = await getDownloadURL(ref(storage, selectedFile.name));

      // Upload image data to Firestore
      const myCollection = collection(firestore, "images");
      const myDocumentData = {
        title: title,
        description: description,
        note: note,
        category: category,
        uid: uid,
        imageURL: downloadURL,
        createdAt: new Date().toString(),
      };
      // Add the document to the collection
      const newDocRef = await addDoc(myCollection, myDocumentData);
      console.log("New document added with ID:", newDocRef.id);

      // Reset form fields and close dialog
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setNote("");
      setCategory("");
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

        {selectedFile && (
          <Typography variant="body2" color="text.secondary">
            Selected file: {selectedFile.name}
          </Typography>
        )}
        {!selectedFile && (
          <Typography variant="body2" color="red">
            Please Select A File
          </Typography>
        )}

        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!title.trim()}
          helperText={!title.trim() && "Title is required"}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!description.trim()}
          helperText={!description.trim() && "Description is required"}
        />
        <TextField
          label="Note (Optional)"
          fullWidth
          margin="normal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Select
          label="Category"
          fullWidth
          displayEmpty
          margin="normal"
          placeholder="Select Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCategoryError("");
          }}
          error={Boolean(categoryError)}
        >
          <MenuItem value="">Select Category</MenuItem>
          {bookCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {categoryError && (
          <Typography variant="body2" color="red">
            {categoryError}
          </Typography>
        )}
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
