import { Typography, Button, Link, Grid, Card, CardContent, CardMedia, Chip, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import "../css/home.css";
import { firestore } from "../firebase";
import { doc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import UploadDialog from "../components/uploadDialog";
import bookCategories from "../utils/categories";

const locations = ["East", "West", "Central", "North"];

function CategoryContent() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // To get userData based on uid of the books
  async function getUserData(uid) {
    const userDocRef = doc(collection(firestore, "users"), uid);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.exists() ? userDocSnapshot.data() : null;
  }

  useEffect(() => {
    // Initial Query Display and Update after Upload
    const getAllImageURLs = async () => {
      try {
        let querySnapshot;
        if (selectedCategory && selectedLocation) {
          // Filter by both category and location
          querySnapshot = await getDocs(
            query(
              collection(firestore, "images"),
              where("category", "==", selectedCategory),
              where("location", "==", selectedLocation)
            )
          );
        } else if (selectedCategory) {
          // Filter only by category
          querySnapshot = await getDocs(
            query(collection(firestore, "images"), where("category", "==", selectedCategory))
          );
        } else if (selectedLocation) {
          // Filter only by location
          querySnapshot = await getDocs(
            query(collection(firestore, "images"), where("location", "==", selectedLocation))
          );
        } else {
          // No filters applied
          querySnapshot = await getDocs(collection(firestore, "images"));
        }

        const imageData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userData = await getUserData(doc.data().uid);
            return {
              id: doc.id,
              userName: userData.name,
              rating: userData.rating,
              ...doc.data(),
            };
          })
        );

        setData(imageData);
      } catch (error) {
        console.error("Error getting image URLs:", error);
      }
    };

    getAllImageURLs();
  }, [open, selectedCategory, selectedLocation]);

  return (
    <div className="home-content">
      {/* Filter by Category */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="subtitle1" sx={{ display: "inline" }}>
          Filter By Category:
        </Typography>
        {bookCategories.map((category) => (
          <Chip
            key={category}
            label={category}
            color={selectedCategory === category ? "primary" : "default"}
            onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
            sx={{ marginRight: "5px", cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* Filter by Location */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="subtitle1" sx={{ display: "inline" }}>
          Filter By Location:
        </Typography>
        {locations.map((location) => (
          <Chip
            key={location}
            label={location}
            color={selectedLocation === location.toLowerCase() ? "primary" : "default"}
            onClick={() =>
              setSelectedLocation(selectedLocation === location.toLowerCase() ? "" : location.toLowerCase())
            }
            sx={{ marginRight: "5px", cursor: "pointer" }}
          />
        ))}
      </Box>

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
                    {item.rating}
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

export { CategoryContent };
