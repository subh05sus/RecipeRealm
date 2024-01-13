import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './RecipeDetails.css'; // Import the CSS file
import Lottie from "react-lottie";
import animationData from "./loadingAnim.json";


const RecipeDetails = ({ setProgress }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProgress(0);
    const fetchRecipeDetails = async () => {
      try {
        setProgress(30);
        const response = await fetch(`https://reciperealm-backend.onrender.com/all/${id}`);
        const data = await response.json();
        setProgress(50);
        if (response.ok) {
          setRecipe(data.recipe);
        } else {
          console.error("Error fetching recipe details:", data.error);
        }
        setTimeout(() => {
          setProgress(100);
        }, 100);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
  }, [id, setProgress]);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="recipe-details">
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
          textAlign: "center"
        }}
      >
        <div>
          <div className="animation-container">
            <Lottie options={defaultOptions} height={200} width={200} />
          </div>
        </div>
        <h1>Loading Recipe Details...</h1>
      </div>      ) : (
        <>
          <h2>{recipe.Name}</h2>
          <p>{recipe.Description}</p>
          {(recipe.author) ? <p className="authorName">by {recipe.author}</p> : <p className="authorName">Annonymous</p>}
          <div className="ingredient-cards">
            {recipe.Ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-card-view">
                {ingredient}
              </div>
            ))}
          </div>

          <p><b>Procedure: </b>{recipe.Procedure}</p>
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
