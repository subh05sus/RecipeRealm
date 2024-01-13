// IngredientCard.js
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { BiTrash } from 'react-icons/bi';


const IngredientCard = ({ index, ingredient, moveCard, handleRemoveIngredient, handleIngredientChange }) => {
    const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "INGREDIENT_CARD",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "INGREDIENT_CARD",
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <div ref={ref} className={`ingredient-card ${isDragging ? "dragging" : ""}`}>
      <div className="ingredient-content">
        <span className="drag-icon">&#x2630;</span>
        <input
          type="text"
          value={ingredient}
          onChange={(e) => handleIngredientChange(index, e.target.value)}
          placeholder={`Ingredient ${index + 1}`}
        />
        <BiTrash className="remove-icon" onClick={() => handleRemoveIngredient(index)} />
      </div>
    </div>
  );
};

export default IngredientCard;
