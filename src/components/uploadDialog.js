import {
  Typography,
  Button,
  TextField,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "../css/home.css";
import { storage, firestore } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import bookCategories from "../utils/categories";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import getUserData from "../utils/getUserData";

//Floating button on bottom right
function UploadDialog({ open, handleClose }) {
  const [uid, setUid] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [isbn, setIsbn] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bookNotFound, setBookNotFound] = useState(false);

  // Check current UID
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
    if (!selectedFile && !thumbnailUrl) {
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
    // Get user location
    const userData = await getUserData(uid);
    try {
      // Upload image file to Firebase Storage
      let downloadURL;
      if (selectedFile) {
        const storageRef = ref(storage, selectedFile.name);
        const metadata = {
          contentType: "image/jpeg",
          customMetadata: {
            title: title,
            description: description,
            note: note,
            category: category,
            uid: uid,
            location: userData.location,
            createdAt: new Date().toString(),
          },
        };

        const uploadTask = uploadBytes(storageRef, selectedFile, metadata);
        await uploadTask;
        downloadURL = await getDownloadURL(ref(storage, selectedFile.name));
      } else {
        downloadURL = thumbnailUrl;
      }

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
        booked: false,
        location: userData.location,
        count: 0,
        rating: 0,
        isbn: isbn,
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
      setThumbnailUrl("");
      setIsbn("");
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Call ISBN API to fetch image and data
  const handleIsbnSearch = async () => {
    try {
      const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`);
      const data = await response.json();
      if (data[`ISBN:${isbn}`]) {
        const bookInfo = data[`ISBN:${isbn}`].details;
        setTitle(bookInfo.title || "");
        setDescription(bookInfo.subtitle || "");
        setCategory(bookInfo.subjects ? bookInfo.subjects[0] : "");
        setThumbnailUrl(data[`ISBN:${isbn}`].thumbnail_url || "");
        setBookNotFound(false); // Reset book not found status if book is found
      } else {
        setBookNotFound(true); // Set book not found status if book is not found
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
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
        {!selectedFile && !thumbnailUrl && (
          <Typography variant="body2" color="red">
            Please Select A File
          </Typography>
        )}

        {thumbnailUrl && (
          <Card style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CardMedia
              component="img"
              src={thumbnailUrl}
              alt="Book Thumbnail"
              style={{ width: "100%", maxWidth: "200px" }}
            />
          </Card>
        )}

        <TextField label="ISBN" fullWidth margin="normal" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        {bookNotFound && (
          <Typography variant="body2" color="error">
            Book not found.
          </Typography>
        )}
        <Button variant="outlined" color="primary" onClick={handleIsbnSearch} disabled={!isbn.trim()}>
          Search
        </Button>

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

export default UploadDialog;
