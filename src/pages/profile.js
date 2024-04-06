import { useState, useEffect } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Link, Card, Chip, CardMedia, CardContent, Grid } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import getUserData from "../utils/getUserData";
import "../css/profile.css";
import Chat from "../utils/chat";

function ProfileContent() {
  const location = useLocation();
  const viewedUser = location.state;
  const [userData, setUserData] = useState(null);
  const [showOfferedBooks, setShowOfferedBooks] = useState(true);
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [userID, setUserID] = useState();
  const [myUserID, setMyUserID] = useState();
  const [viewedUserID, setViewedUserID] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserID(user.uid);
        const fetchUserData = async () => {
          const fetchedUserData = await getUserData(user.uid);
          setUserData(fetchedUserData);
        };
        fetchUserData();
        setMyUserID(user.uid);
      } else {
        console.log("User not logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // if not me, view someone else
  useEffect(() => {
    if (viewedUser) {
      setUserID(viewedUser.uid);
      setViewedUserID(viewedUser.uid);
      const fetchUserData = async () => {
        const fetchedUserData = await getUserData(viewedUser.uid);
        setUserData(fetchedUserData);
      };
      fetchUserData();
    }
  }, [viewedUser]);
  return (
    <Box margin="2.5% 0" display="flex" justifyContent="center">
      <Chat userId={myUserID} secondUserId={viewedUserID} />
      <Box width="90vw">
        {/* Profile content */}
        <Typography variant="h4" align="center" gutterBottom>
          My Profile
        </Typography>

        {userData ? (
          <Box textAlign="center">
            <img
              src="https://via.placeholder.com/150"
              alt="User"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            <Typography variant="body1">
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="body1">
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {userData.phoneNumber}
            </Typography>
            <StarRating rating={userData.rating} />
            <Typography variant="body1">
              <strong> {userData.rating} / 5.0</strong>
            </Typography>
            {/* Buttons to toggle visibility of Offered Books and Borrowed Book History */}
            <Box marginTop="20px">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowOfferedBooks(!showOfferedBooks);
                  setShowBorrowedBooks(!showBorrowedBooks);
                }}
                sx={{ marginRight: "10px" }}
              >
                {showOfferedBooks ? "Hide Offered Books" : "Show Offered Books"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowOfferedBooks(!showOfferedBooks);
                  setShowBorrowedBooks(!showBorrowedBooks);
                }}
              >
                {showBorrowedBooks ? "Hide Borrowed Book History" : "Show Borrowed Book History"}
              </Button>
            </Box>
            {showOfferedBooks && <OfferedBooks userID={userID} />}

            {showBorrowedBooks && <BorrowedBookHistory />}
          </Box>
        ) : (
          // Prompt to login
          <Box>
            <Typography variant="h5" textAlign={"center"}>
              You are not logged in,{" "}
              <Link component={RouterLink} to="/">
                click here to login
              </Link>
              .
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
function OfferedBooks({ userID }) {
  const [offeredBooks, setOfferredBooks] = useState([]);
  const getBooksData = async (uid) => {
    try {
      let booksData = [];

      const q = query(collection(firestore, "images"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      booksData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userData = await getUserData(doc.data().uid);
          const data = doc.data();
          return {
            id: doc.id,
            userName: userData.name,
            userRating: userData.rating,
            ...data,
          };
        })
      );
      setOfferredBooks(booksData);
      return booksData;
    } catch (error) {
      console.error("Error retrieving books data:", error);
      return [];
    }
  };
  useEffect(() => {
    getBooksData(userID);
  }, [userID]);

  return (
    <Box marginTop="20px">
      <Typography variant="h5" gutterBottom>
        My Offered Books
      </Typography>
      {/* Grid container */}
      <Grid container spacing={2}>
        {/* Map data to grid items */}
        {offeredBooks.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            {/* Card container */}
            <Card style={{ height: "100%", textAlign: "left", position: "relative" }}>
              {/* Grey overlay for booked items */}
              {item.booked && (
                <Link component={RouterLink} to={"/details"} state={item}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      zIndex: 1,
                    }}
                  ></div>
                </Link>
              )}
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
                    height: "60px", // Set a fixed height for the title
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
    </Box>
  );
}

// PlaceHolder
function BorrowedBookHistory() {
  const offeredBooks = [
    { id: 1, title: "Book 1", author: "Author 1" },
    { id: 2, title: "Book 2", author: "Author 2" },
    { id: 3, title: "Book 3", author: "Author 3" },
  ];

  return (
    <Box marginTop="20px">
      <Typography variant="h5" gutterBottom>
        My History
      </Typography>
      {offeredBooks.map((book) => (
        <Box key={book.id} marginBottom="10px">
          <Typography variant="subtitle1">Title: {book.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Author: {book.author}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// Show Star Rating
function StarRating({ rating }) {
  const roundedRating = Math.round(rating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<StarIcon key={i} sx={{ color: "#FDCC0D" }} />);
    } else {
      stars.push(<StarOutlineIcon key={i} sx={{ color: "#FDCC0D" }} />);
    }
  }
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {stars}
    </Box>
  );
}
export { ProfileContent };
