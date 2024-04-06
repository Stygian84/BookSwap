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

function DetailsContent() {
  const location = useLocation();
  const item = location.state;
  const [booked, setBooked] = useState(item.booked);
  const [userID, setUserID] = useState();

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
              style={{ backgroundColor: booked || item.uid === userID ? "grey" : "" }}
            >
              {booked ? "Booked" : item.uid === userID ? "Owned" : "Book Now"}
            </Button>
          </div>
        </div>
      </div>
      <div className="synopsis">
        <Typography variant="h3">Synopsis</Typography>
        {/* Add synopsis content here */}
      </div>
      <div className="comment">
        <Typography variant="h3">Comment Section</Typography>
        {/* Add comment section content here */}
      </div>
    </div>
  );
}

export default DetailsContent;
