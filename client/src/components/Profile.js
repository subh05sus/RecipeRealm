import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "./loadingAnim.json";

const Profile = () => {
  const { isAuthenticated, user } = useAuth0();
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await fetch(
          "https://reciperealm-backend.onrender.com/all"
        );
        const data = await response.json();

        if (response.ok) {
          const recipesByUser = data.recipes.filter(
            (recipe) => recipe.author === user.name
          );
          setUserRecipes(recipesByUser);
        } else {
          console.error("Error fetching recipes:", data.error);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserRecipes();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user.name]);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="profile-container">
      {loading ? (
        <div
          className="no-page-container"
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div>
            <div className="animation-container">
              <Lottie options={defaultOptions} height={200} width={200} />
            </div>
          </div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="profile-recipes">
          <h2>Your Recipes</h2>
          {userRecipes.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            <div className="recipe-cards">
              {userRecipes.map((recipe) => (
                <Link
                  to={`/recipe/${recipe.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div key={recipe.id} className="recipe-card">
                    <h3>{recipe.Name}</h3>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap"
                      }}
                    >
                      {recipe.Ingredients.map((ingredient, index) => (
                        <span key={index} className="profileIngredients">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
