import { useEffect, useState } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Typography, Button, Link } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { firestore, auth } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import getUserData from "../utils/getUserData";
import "../css/details.css";

function DetailsContent() {
  const location = useLocation();
  const [item, setItem] = useState(location.state);
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

  // When book button / Rating is pressed, update UI
  useEffect(() => {
    const fetchData = async () => {
      const imageRef = doc(firestore, "images", item.id);

      try {
        const docSnapshot = await getDoc(imageRef);
        if (docSnapshot.exists()) {
          const userData = await getUserData(docSnapshot.data().uid);
          const data = docSnapshot.data();
          const result = {
            id: docSnapshot.id,
            userName: userData.name,
            userRating: userData.rating,
            ...data,
          };
          setItem(result);
        } else {
          console.log("No such document exists!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchData();
  }, [booked, rated, item.id]);

  const handleRatingChange = async (rating) => {
    try {
      const myDoc = doc(firestore, "images", item.id);
      if (!item.rating) {
        item.rating = 0;
        await updateDoc(myDoc, { rating: 0, count: 0 });
      }
      let newCount, newAverage;
      if (!item.count) {
        item.count = 0;
      }
      newCount = item.count + 1;
      newAverage = (item.rating * item.count + rating) / newCount;
      console.log(newCount, newAverage);
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
              <strong>Owner: </strong>

              <Link component={RouterLink} to={"/profile"} state={item} color="inherit">
                {item.userName}
              </Link>
            </Typography>
            <Typography className="description-text">
              <strong>Category:</strong> {item.category}
            </Typography>
            <Typography className="description-text">
              <strong>Description:</strong> {item.description}
            </Typography>
            <Typography className="description-text">
              <strong>Location:</strong> {item.location.charAt(0).toUpperCase() + item.location.slice(1)}
            </Typography>
            {item.isbn !== "" && (
              <Typography className="description-text">
                <strong>ISBN:</strong> {item.isbn}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleBookNow}
              disabled={booked || item.uid === userID}
              style={{ width: "20vw", backgroundColor: booked || item.uid === userID ? "grey" : "" }}
            >
              {booked ? "Booked" : item.uid === userID ? "Owned" : "Book Now"}
            </Button>
            <Typography className="description-text" sx={{ marginTop: "10px" }}>
              Current Book Rating: <strong>{item.rating}</strong> by {item.count > 1 ? `${item.count} users` : "1 user"}
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

// Hoverable Star Rating (to rate something)
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
