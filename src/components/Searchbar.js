import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SearchbarWrapper = styled.div`
  margin-left: 10px;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 200px;
  height: 36px;
  border: none;
  border-radius: 18px;
  padding: 0 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.9rem;
  transition: background-color 0.3s, width 0.3s;

  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
    width: 250px;
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Searchbar = () => {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/search?q=${term}`);
  };

  return (
    <SearchbarWrapper>
      <SearchForm onSubmit={submitHandler}>
        <label htmlFor="search">
          <SearchInput
            type="text"
            id="search"
            placeholder="Search"
            onChange={(e) => setTerm(e.target.value)}
            required
          />
        </label>
      </SearchForm>
    </SearchbarWrapper>
  );
};

export default Searchbar;
