import "./Activity.css";
import { useNavigate, useParams } from "react-router-dom";
import Trashcan from "../../assets/trashcan.svg"
import Edit from "../../assets/edit.png"
import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { AuthContext } from "../../context/Auth";
import { useContext } from "react";
import {confirmAlert} from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css";

const Activity = () => {
  const { id } = useParams();
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate();
  
  const deleteHandler = (e, id) =>{
    e.preventDefault();
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => projectFirestore.collection("Activities").doc(id).delete()
        },
        {
          label: "No",
          onClick: () => <input type="text"></input>
        }
      ]
    });
  };

  const editHandler = (e, id) =>{
    e.preventDefault();
  }

  // const clickHandler = () =>{
  //   projectFirestore.collection("Activities").doc(id).update({
  //     title: "something else"
  //   })
  // }

  useEffect(()=>{
    setIsPending(true);
    const unsub = projectFirestore.collection('Activities').doc(id).onSnapshot((doc) =>{
      if(doc.exists){
        setIsPending(false);
        setData(doc.data());
      } else{
        setIsPending(false);
        setError("Could not find that activity...");
        navigate("/")
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
          {currentUser.uid===data.uid && <img className="delete" alt="Delete" src={Trashcan} onClick={(e)=>deleteHandler(e,id)}/>}
          {currentUser.uid===data.uid && <img className="edit" alt="Edit" src={Edit} onClick={(e)=>editHandler(e,id)}/>}
        </>
      )}
    </div>
  );
};

export default Activity;
