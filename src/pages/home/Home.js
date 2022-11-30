import "./Home.css";

import React, { useEffect, useState } from "react";
import ActivityList from "../../components/ActivityList";
import { projectFirestore } from "../../firebase/config";

const Home = () => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const unsub = projectFirestore.collection("Activities").onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError("No activities to load...");
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
  }, []);

  return (
    <div className="home">
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <ActivityList activities={data} />}
    </div>
  );
};

export default Home;
