import "./Activity.css";
import { useNavigate, useParams } from "react-router-dom";
import Trashcan from "../../assets/trashcan.svg"
import Edit from "../../assets/edit.png"
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { AuthContext } from "../../context/Auth";
import { useContext } from "react";
import {confirmAlert} from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css";
import CustomUI from "../../UI/CustomUi";
import Tasks from "./Tasks";
import axios from "axios"; 

const Activity = () => {
  const { id } = useParams();
  const [data, setData] = useState(null)
  const [showButton, setShowButton] = useState()
  const [role, setRole] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate();
  
  const deleteHandler = (e, id) =>{
    e.preventDefault();
    confirmAlert({
      title: "Delete Activity?",
      message: "Are you sure you want to delete this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => projectFirestore.collection("Activities").doc(id).delete() && navigate("/")
        },
        {
          label: "No",
          onClick: () => ""
        }
      ]
    });
  };

  const editHandler = (e, id, data) =>{
    e.preventDefault();
    confirmAlert({
      customUI: ({onClose}) => {
        return (
          <CustomUI e={e} id={id} data={data} onClose={onClose}/>          
        );
      }
    });
  }

  const sendEmail = async (emailData) => {
    try {
      const response = await axios.post("http://localhost:3008/send-email", emailData);
      console.log("Email sent successfully", response);
    } catch (error) {
      console.error("Error sending email", error);
    }
  };
  

  const joinHandler = (joinedUsers, id) => {
    const userIndex = joinedUsers.indexOf(currentUser.displayName);
    if (userIndex !== -1) {
      setRole("Volunteer");
      joinedUsers.splice(userIndex, 2);
      projectFirestore.collection("Activities").doc(id).update({ joinedUsers });
      setShowButton(true);
      return;
    } else {
      joinedUsers.push(currentUser.displayName, "Volunteer"); // Directly push "Volunteer" to the array
      projectFirestore.collection("Activities").doc(id).update({ joinedUsers });
      setShowButton(false);
      const emailData = {
        to: data.contactInfo, // The email address of the coordinator
        subject: "A user joined your activity",
        text: `A user ${currentUser.displayName} has joined your activity "${data.title}"`,
      };
      sendEmail(emailData);
      return;
    }
  };

  useEffect(()=>{
    setIsPending(true);
    const unsub = projectFirestore.collection('Activities').doc(id).onSnapshot((doc) =>{
      if(doc.exists){
        setIsPending(prev => {
          setIsPending(false);
        });
        setData(doc.data());
      } else{
        setIsPending(false);
        setError("Could not find that activity...");
        navigate("/")
      }
      if(doc.data().joinedUsers.includes(currentUser.displayName)){
        setShowButton(true);
      }
      else{
        setShowButton(false);
      }
    })
    return () => unsub();
  }, [id, navigate,currentUser.displayName])

  return (
    <div className="activity">
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && (
        <>
          <h2 className="page-title">{data.title}</h2>
          <div className="icons">
          {currentUser.uid===data.uid && <img className="delete" alt="Delete" src={Trashcan} onClick={(e)=>deleteHandler(e,id)}/>}
    {currentUser.uid===data.uid && <img className="edit" alt="Edit" src={Edit} onClick={(e)=>editHandler(e,id, data)}/>}
          </div>
          <p className="method">{data.description}</p>
          <p className="user">Created by: {data.displayName}</p>
          <p className="user">Contact Info: {data.contactInfo}</p>
          <div className="other_display">
          <p className="other"><b>Activity length:</b>{data.activityTime} minutes.</p>
          <p className="other"><b>Date and time:</b> {data.date}, {data.time}</p>
          <p className="other"><b>Location:</b> {data.city}, {data.street}</p>
          </div>
          <div className="buttonWrapper">
          <button className="button"  onClick={() => joinHandler(data.joinedUsers, id)}>{showButton ? "Leave" : "Join!"}</button>
          {showButton && <button className="button"><Link to={`/activities/${id}/volunteers`}>Volunteers</Link></button>}
          </div>
          <ul>
            {data.tags.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </>
      )}
      <Tasks activityId={id} activityData={data}/>
    </div>
  );
};

export default Activity;
