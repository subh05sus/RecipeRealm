// NewRecipe.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import IngredientCard from "./IngredientCard";
import "./NewRecipe.css";
const MAX_DESCRIPTION_LENGTH = 100; // Define the maximum description length

const NewRecipe = ({ setProgress }) => {
  const { isAuthenticated, user } = useAuth0();
  let author = "Anonymous";
  if (isAuthenticated) author = user.name;

  setProgress(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress(100);
    }, 100);
  }, [setProgress]);

  const navigate = useNavigate();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [procedure, setProcedure] = useState("");
  const [description, setDescription] = useState(""); // New state for description

  const handleAddIngredient = () => {
    if (ingredients.length < 10) {
      setIngredients((prevIngredients) => [...prevIngredients, ""]);
    }
  };

  const handleIngredientChange = (index, value) => {
    let updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (index) => {
    let updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const moveCard = (dragIndex, hoverIndex) => {
    const updatedIngredients = [...ingredients];
    const dragCard = updatedIngredients[dragIndex];

    updatedIngredients.splice(dragIndex, 1);
    updatedIngredients.splice(hoverIndex, 0, dragCard);

    setIngredients(updatedIngredients);
  };

  const handleSubmit = async () => {
    if (!recipeTitle.trim()) {
      alert("Please enter a recipe name.");
      return;
    }

    if (ingredients.filter((ingredient) => ingredient.trim()).length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    if (!procedure.trim()) {
      alert("Please enter the recipe procedure.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter the recipe desciption.");
      return;
    }

    try {
      const response = await fetch("https://reciperealm-backend.onrender.com/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: recipeTitle,
          ingredients: ingredients.filter((ingredient) => ingredient.trim()),
          procedure,
          description, 
          author,
        }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error adding new recipe:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding new recipe:", error);
    }
  };

  return (
    <div className="new-recipe">
      <h2 className="recipeHeader">Add New Recipe</h2>
      <input
        placeholder="Enter Recipe Name..."
        type="text"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
        className="recipeNameInput"
      />
        <textarea
        placeholder="Description (Max 100 characters)"
          className="descArea"
          value={description}
          onChange={(e) => {
            const limitedDescription = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
            setDescription(limitedDescription);
          }}></textarea>


      <DndProvider backend={HTML5Backend}>
        {ingredients.map((ingredient, index) => (
          <IngredientCard
            key={index}
            index={index}
            ingredient={ingredient}
            moveCard={moveCard}
            handleRemoveIngredient={handleRemoveIngredient}
            handleIngredientChange={handleIngredientChange}
          />
        ))}
      </DndProvider>
      {ingredients.length < 10 && (
        <button onClick={handleAddIngredient} className="addButton">
          +
        </button>
      )}
      <p>Procedure:</p>
      <textarea
        className="recipeTextarea"
        value={procedure}
        onChange={(e) => setProcedure(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit} className="submitButton">
        Submit Recipe
      </button>
    </div>
  );
};

export default NewRecipe;
