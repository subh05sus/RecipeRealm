import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./components/navbar";
import Homepage from "./components/homepage";
import RecipeDetails from "./components/RecipeDetails";
import NewRecipe from "./components/NewRecipe";
import FloatingButton from "./components/FloatingButton";
import NoPage from "./components/noPage";
import LoadingBar from 'react-top-loading-bar'
import UserProfileButton from './components/UserProfileButton';
import Profile from "./components/Profile";

import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth0();
  const [progress, setProgress] = useState(0)

  return (
    <div>
      <Router>
      {<Navbar />}
      <LoadingBar
        color='#b2a6ff'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
        <Routes>
          <Route index element={<Homepage setProgress = {setProgress} />} />
          <Route path="recipe/:id" element={<RecipeDetails setProgress = {setProgress} />} />
          <Route path="new" element={<NewRecipe setProgress = {setProgress} />} />
          <Route path='profile' element={<Profile setProgress={setProgress} />} />
          <Route path="*" element={<NoPage setProgress = {setProgress} />} />
        </Routes>
        {isAuthenticated? 
        <div>
          <UserProfileButton/>
          <FloatingButton />
        </div>
        :
        null
        }
      </Router>
    </div>
  );
};

export default App;
