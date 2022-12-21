import React from "react";
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import ActivityList from "../../components/ActivityList";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import "./MyLikes.css"

const MyLikes = () => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);
    const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsPending(true);
    const unsub = projectFirestore.collection("Activities").where("likedUsers", "array-contains", currentUser.uid ).onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError("No activities to load...");
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setData(results);
          setIsPending(false);
        } else {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setData(results);
          setIsPending(false);
        }
      },
      (err) => {
        setError(err.message);
        setIsPending(false);
      }
    );

    return () => unsub();
  }, [currentUser.uid]);

  return (
    <div className="mylikes">
    <h2>My Likes</h2>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <ActivityList activities={data} />}
    </div>
  );

};

export default MyLikes;
