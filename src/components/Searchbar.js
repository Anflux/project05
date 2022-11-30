import "./Searchbar.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/search?q=${term}`);
  };

  return (
    <div className="searchbar">
      <form onSubmit={submitHandler}>
        <label htmlFor="search">
        <input
          type="text"
          id="search"
          placeholder="Search"
          onChange={(e) => setTerm(e.target.value)}
          required
        />
        </label>
      </form>
    </div>
  );
};

export default Searchbar;
