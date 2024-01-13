// FloatingButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingButton.css';

const FloatingButton = () => {
  const navigate = useNavigate();

  const handleNewRecipeClick = () => {
    navigate('/new');
  };

  return (
    <div className="floating-button" onClick={handleNewRecipeClick}>
      <div className="icon">+</div>
      <div className="text">Add New Recipe</div>
    </div>
  );
};

export default FloatingButton;
