import { useLocation } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { storage, firestore, auth } from "../firebase";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  getDoc,
} from "firebase/firestore";
import "../css/details.css";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

function DetailsContent() {
  const location = useLocation();
  const item = location.state;
  const [booked, setBooked] = useState(item.booked);
  const [userID, setUserID] = useState();
  const [rated, setRated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserID(user.uid);
      } else {
        console.log("User not logged in.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Book Button Handler
  const handleBookNow = async () => {
    try {
      const myDoc = doc(firestore, "images", item.id);
      await updateDoc(myDoc, { booked: true });
      setBooked(true);
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  // When book button is pressed, update UI
  useEffect(() => {}, [booked]);

  const handleRatingChange = async (rating) => {
    try {
      const myDoc = doc(firestore, "images", item.id);
      console.log(rating);
      if (!item.bookRating) {
        item.bookRating = 0;
        await updateDoc(myDoc, { rating: 0, count: 0 });
      }
      let newCount, newAverage;
      if (item.count === null) {
        newCount = 1;
        newAverage = rating;
      } else {
        newCount = item.count + 1;
        newAverage = (item.bookRating * item.count + rating) / newCount;
      }
      await updateDoc(myDoc, { rating: newAverage, count: newCount });

      console.log("Rating updated successfully");
      setRated(true);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };
  return (
    <div className="details-container">
      <div className="picture-container">
        <div className="picture">
          <img src={item.imageURL} alt={item.title} />
        </div>
        <div className="desc">
          <Typography variant="h2">{item.title}</Typography>
          <div className="text-container">
            <Typography className="description-text">
              <strong>Owner:</strong> {item.userName}
            </Typography>
            <Typography className="description-text">
              <strong>Category:</strong> {item.category}
            </Typography>
            <Typography className="description-text">
              <strong>Description:</strong> {item.description}
            </Typography>

            <Button
              variant="contained"
              onClick={handleBookNow}
              disabled={booked || item.uid === userID}
              style={{ width: "20vw", backgroundColor: booked || item.uid === userID ? "grey" : "" }}
            >
              {booked ? "Booked" : item.uid === userID ? "Owned" : "Book Now"}
            </Button>
            <Typography className="description-text" sx={{ marginTop: "10px" }}>
              Current Book Rating: <strong>{item.rating}</strong> by {" "}
              {item.count > 1 ? `${item.count} users` : "1 user"}
            </Typography>
            <Typography className="description-text" sx={{ marginTop: "10px" }}>
              <strong>Rate this book</strong>
            </Typography>

            <div style={{ display: "flex", alignItems: "center" }}>
              <StarRating initialRating={item.bookRating || 0} onChange={handleRatingChange} rated={rated} />
            </div>
            {rated && <Typography>Thank you for rating!</Typography>}
          </div>
        </div>
      </div>
      <div className="synopsis">
        <Typography variant="h3">Synopsis</Typography>
        {/* Add synopsis content here */}
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum."
      </div>
      <div className="comment">
        <Typography variant="h3">Comment Section</Typography>
        {/* Add comment section content here */}
      </div>
    </div>
  );
}

function StarRating({ initialRating, onChange, rated }) {
  const [rating, setRating] = useState(initialRating);
  const handleMouseEnter = (index) => {
    if (!rated) {
      setRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!rated) {
      setRating(initialRating);
    }
  };

  const handleClick = (index) => {
    if (!rated) {
      setRating(index);
      onChange(index === 5 ? 5 : index);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <StarIcon
          key={index}
          sx={{ color: index <= rating ? "#FDCC0D" : "gray", cursor: "pointer" }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
export default DetailsContent;
