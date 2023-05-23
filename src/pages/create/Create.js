import "./Create.css";

import React, { useRef, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { AuthContext } from "../../context/Auth";
import lithuanianCities from "./LithuanianCities";

const Create = () => {
  const { currentUser } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [street, setStreet] = useState("");
  const [contactInfo, setContactInfo] = useState(currentUser.email);
  const [tags, setTags] = useState([]);
  const activityInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (city) {
      const filtered = lithuanianCities.filter((c) =>
        c.toLowerCase().startsWith(city.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [city]);

  const handleCitySelection = (selectedCity) => {
    setCity(selectedCity);
    setFilteredCities([]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let likes = 1;
    let likedUsers = [currentUser.uid];
    let role = "Coordinator"
    let joinedUsers = [currentUser.displayName, role]
    
    const doc = {
      title,
      tags,
      description,
      activityTime: activityTime,
      date,
      time,
      city,
      street,
      joinedUsers,
      likedUsers,
      likes,
      contactInfo,
      uid: currentUser.uid,
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
    let titleTags = title.split(' ');
    titleTags = titleTags.map(tag => tag.toLowerCase());
    setTags(titleTags);
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
              <em key={activity}>{activity} </em>
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
            min= {new Date().toJSON().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />
        </label>
        <label className="other">
          <span>Time:</span>
          <input
            type="time"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            required
          />
        </label>
        <label className="city-input">
        <span>City:</span>
        <input
          type="text"
          onChange={(e) => setCity(e.target.value)}
          value={city}
          required
        />
        {filteredCities.length > 0 && (
          <ul className="autocomplete-dropdown">
            {filteredCities.map((city) => (
              <li
                key={city}
                onClick={() => handleCitySelection(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
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
