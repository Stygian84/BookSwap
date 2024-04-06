import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  Link,
  Grid,
  Avatar,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import LogoImage from "../images/logo.png";
import "../css/home.css";
import { firestore } from "../firebase";
import { collection, getDocs, query, where, orderBy, startAt } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import UploadDialog from "../components/uploadDialog";
import getUserData from "../utils/getUserData";

function HomeTop() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Avatar src={LogoImage} alt="Logo" sx={{ marginRight: "10px" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BookSwap
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link href="/home" color="inherit" underline="none" sx={{ marginRight: "10px" }}>
            Browse
          </Link>
          <Link href="/category" color="inherit" underline="none" sx={{ marginRight: "10px" }}>
            Categories
          </Link>
          <Link href="/profile" color="inherit" underline="none">
            My Profile
          </Link>
        </Box>
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

  // Initial Query Display and Update after Upload
  const getAllImageURLs = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "images"));
      const imageData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userData = await getUserData(doc.data().uid);
          return {
            id: doc.id,
            userName: userData.name,
            userRating: userData.rating,
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
  }, [open]);

  // Search Function
  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchTerm.trim() === "") {
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
          startAt(searchTerm.trim())
        );
        const querySnapshot = await getDocs(q);
        searchResults = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userData = await getUserData(doc.data().uid);
            const data = doc.data();
            if (data.title.toLowerCase().startsWith(searchTerm.trim().toLowerCase())) {
              return {
                id: doc.id,
                userName: userData.name,
                userRating: userData.rating,
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

      {/* Container for Book Items */}
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card style={{ height: "100%" }}>
              <Link component={RouterLink} to={"/details"} state={item}>
                <CardMedia
                  component="img"
                  height="300"
                  image={item.imageURL}
                  alt={item.title}
                  style={{ cursor: "pointer" }}
                />
              </Link>
              <CardContent style={{ height: "100%" }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    height: "60px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ fontStyle: "italic" }}>{item.userName}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {item.userRating}
                    <StarIcon sx={{ color: "#FDCC0D" }} />
                  </div>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
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

export { HomeTop, HomeContent };
