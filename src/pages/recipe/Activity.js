import "./Activity.css";
import { useParams } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";

const Activity = () => {
  const { id } = useParams();
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  


  const clickHandler = () =>{
    projectFirestore.collection("Activities").doc(id).update({
      title: "something else"
    })
  }

  useEffect(()=>{
    setIsPending(true);
    const unsub = projectFirestore.collection('Activities').doc(id).onSnapshot((doc) =>{
      if(doc.exists){
        setIsPending(false);
        setData(doc.data())
      } else{
        setIsPending(false);
        setError("Could not find that activity...")
      }
    })
    return () => unsub();
  }, [id])

  return (
    <div className="activity">
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && (
        <>
          <h2 className="page-title">{data.title}</h2>
          <p>Will take {data.activityTime} to do.</p>
          <ul>
            {data.tags.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
          <p className="method">{data.description}</p>
          <p className="other">{data.date}, {data.time}</p>
          <p className="other">{data.city}, {data.street}</p>
          <p className="user">Created by: {data.displayName}</p>
          <p className="user">Contact Info: {data.contactInfo}</p>
        </>
      )}
    </div>
  );
};

export default Activity;
