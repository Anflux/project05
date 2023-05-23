import React from "react";
import "./CustomUI.css";
import { useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

function CustomUi({ e, id, data, onClose}) {
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [activityTime, setActivityTime] = useState(data.activityTime);
  const [newActivity, setNewActivity] = useState();
  const [date, setDate] = useState(data.date);
  const [time, setTime] = useState(data.time);
  const [city, setCity] = useState(data.city);
  const [street, setStreet] = useState(data.street);
  const [contactInfo, setContactInfo] = useState(data.contactInfo);
  const [tags, setTags] = useState(data.tags);
  const activityInput = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const fields = {
      title,
      tags,
      description,
      activityTime: activityTime,
      date,
      time,
      city,
      street,
      contactInfo,
    };
    try {
      await projectFirestore.collection("Activities").doc(id).update(fields);
      onClose();
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
    <div className="popup-overlay">
      <div className="create">
        <h2 className="page-title">Edit Activity</h2>
        <form onSubmit={submitHandler}>
          <label>
            <span>Activity Title:</span>
            <input className="this-title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              maxlength="50"
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
            <textarea
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
                maxlength="20"
              />
            </label>
            <label className="other">
              <span>Street:</span>
              <input
                type="text"
                onChange={(e) => setStreet(e.target.value)}
                value={street}
                required
                maxlength="30"
              />
            </label>
            <label className="other">
              <span>Contact info:</span>
              <input
                type="text"
                onChange={(e) => setContactInfo(e.target.value)}
                value={contactInfo}
                required
                maxlength="30"
              />
            </label>
          </div>
          <button className="btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CustomUi;
