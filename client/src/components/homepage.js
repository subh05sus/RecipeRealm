import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import the cross icon
import Lottie from "react-lottie";
import animationData from "./loadingAnim.json";

const Homepage = ({ setProgress }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setProgress(10);
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "https://reciperealm-backend.onrender.com/all"
        );
        await setProgress(30);
        const data = await response.json();
        await setProgress(80);
        setRecipes(data.recipes);
        setLoading(false);
        setTimeout(() => {
          setProgress(100);
        }, 100);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [setProgress]);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.Ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleInputChange = (e) => {
    const inputValue = e.target.value.length * 10;
    const inputElement = e.target;

    inputElement.style.width =
      inputValue > 500
        ? "500px"
        : inputValue < 300
        ? "300px"
        : inputValue + "px";

    setSearchTerm(e.target.value);
  };

  const handleInputBlur = () => {
    // Restore the width when the input loses focus
    inputRef.current.style.width = "300px";
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="main-body">
      <div className="search-bar">
        <input
          ref={inputRef}
          className="searchInput"
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {searchTerm && (
          <FaTimes className="clear-icon" onClick={() => setSearchTerm("")} />
        )}
      </div>
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
          <h1>Loading Recipes...</h1>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.Name} className="recipe-card">
              <h3>{recipe.Name}</h3>
              <p className="descHome">{recipe.Description}</p>
              <div className="ingredientListHomePage">
                {recipe.Ingredients.map((ingredient, index) => (
                  <div key={index} className="HomePageIngredients">
                    {ingredient}
                  </div>
                ))}
              </div>
              <Link to={`/recipe/${recipe.id}`} style={{ color: "#5500b7" }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
