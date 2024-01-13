// UserProfileButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import './UserProfileButton.css';

function UserProfileButton() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  let profileIcon = user.picture || 'https://cdn-icons-png.flaticon.com/512/9706/9706577.png';

  return (
    <div className="floating-button-2" onClick={handleProfileClick} title='View Your Recipes'>
      <img src={profileIcon} alt='User Profile' />
      <div className="text">View Your Recipes</div>
    </div>
  );
}

export default UserProfileButton;
