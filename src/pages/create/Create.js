import "./Create.css";

import React, { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { AuthContext } from "../../context/Auth";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [tags, setTags] = useState([]);
  const activityInput = useRef(null);
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const doc = {
      title,
      tags,
      description,
      activityTime: activityTime + " minutes ",
      date,
      time,
      city,
      street,
      contactInfo,
      uid: currentUser.uid,
      displayName: currentUser.displayName,
    };
    try {
      await projectFirestore.collection("Activities").add(doc);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const addHandler = (e) => {
    e.preventDefault();
    const ing = newActivity.trim();
    if (ing && !tags.includes(ing)) {
      setTags((prevTags) => [...prevTags, ing]);
    }
    setNewActivity("");
    activityInput.current.focus();
  };

  return (
    <div className="create">
      <h2 className="page-title">Add a new activity</h2>
      <form onSubmit={submitHandler}>
        <label>
          <span>Activity Title:</span>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </label>

        <label>
          <span>Activity Tags:</span>
          <div className="tags">
            <input
              type="text"
              onChange={(e) => setNewActivity(e.target.value)}
              value={newActivity}
              ref={activityInput}
            />
            <button className="btn" onClick={addHandler}>
              add
            </button>
          </div>
          <p>
            Current Tags:{" "}
            {tags.map((activity) => (
              <em key={activity}>{activity}, </em>
            ))}
          </p>
        </label>

        <label>
          <span>Activity Description:</span>
          <input
            className="description"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </label>
        <div className="specifics">
        <label className="other">
          <span>Activity Time (minutes):</span>
          <input
            type="number"
            onChange={(e) => setActivityTime(e.target.value)}
            value={activityTime}
            required
          />
        </label>
        <label className="other">
          <span>Date:</span>
          <input
            type="date"
            min="2022-11-30"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />
        </label>
        <label className="other">
          <span>time:</span>
          <input
            type="time"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            required
          />
        </label>
        <label className="other">
          <span>City:</span>
          <input
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            required
          />
        </label>
        <label className="other">
          <span>Street:</span>
          <input
            type="text"
            onChange={(e) => setStreet(e.target.value)}
            value={street}
            required
          />
        </label>
        <label className="other">
          <span>Contact info:</span>
          <input
            type="text"
            onChange={(e) => setContactInfo(e.target.value)}
            value={contactInfo}
            required
          />
        </label>
        </div>
        <button className="btn">Submit</button>
      </form>
    </div>
  );
};

export default Create;
