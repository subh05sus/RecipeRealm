const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require('body-parser'); 
const serviceAccount = require("./secret.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json()); 

app.get('/all', async (req, res) => {
  try {
    const firestore = admin.firestore();
    const recipesCollection = firestore.collection('recipes');

    const snapshot = await recipesCollection.get();
    const firestoreRecipes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        author: data.author || 'Unknown',
      };
    });

    const allRecipes = [...recipes, ...firestoreRecipes];

    res.json({ recipes: allRecipes });
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/all/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const firestore = admin.firestore();
      const recipeDoc = await firestore.collection('recipes').doc(id).get();
  
      if (!recipeDoc.exists) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
  
      const recipeData = recipeDoc.data();
      res.json({ recipe: { id: recipeDoc.id, ...recipeData } });
    } catch (error) {
      console.error('Error fetching recipe details from Firestore:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/add', async (req, res) => {
    try {
      const { title, ingredients, procedure, author, description } = req.body;
      const firestore = admin.firestore();
  
      const id = randomId();
  
      firestore.collection('recipes').doc(id.toString()).set({
          Name: title,
          Ingredients: ingredients,
          Procedure: procedure,
          id: id,
          author: author,
          Description:description
      });

  
      res.status(200).json({
        message: 'Recipe added successfully!',
        recipeId: id,
      });
    } catch (error) {
      console.error('Error adding new recipe:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => console.log(`Server is listening on port ${port}!`));

const randomId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };



//   const recipes = [
//     {
//       id: "01khdasA98SD2a3",
//       Ingredients: [
//         "Chicken",
//         "Basmati Rice",
//         "Potatoes",
//         "Onions",
//         "Tomatoes",
//         "Ginger",
//         "Garlic",
//         "Yogurt",
//         "Spices",
//       ],
//       Procedure: `
//         Start by marinating the chicken with a mixture of yogurt, ginger-garlic paste, and spices. Allow it to marinate for at least 30 minutes.
//         In a separate pot, parboil basmati rice with whole spices until it's 70% cooked. Drain the rice and set it aside.
//         In a large pan, sauté sliced onions until golden brown, reserving half for garnishing.
//         Add the marinated chicken to the pan and cook until it's almost done.
//         Layer the partially cooked rice over the chicken, sprinkle fried onions, and drizzle saffron-infused milk.
//         Cover and cook on low heat until the rice is fully cooked and aromatic.
//         Garnish the Chicken Biryani with fresh coriander and mint leaves.
//         Finally, serve it hot with raita and enjoy the flavorful Chicken Biryani!
//       `,
//       Name: "Chicken Biryani",
//       Author: "Default",
//       Description: "Experience the richness of this famous dish featuring aromatic rice and flavorful chicken."
//     }
//   ];
  



// const uploadRecipesToFirestore = async () => {
//     const firestore = admin.firestore();
  
//     for (const recipe of recipes) {
//       const { id, ...recipeData } = recipe;
  
//       try {
//         // Set the recipe data in Firestore with the specified ID
//         await firestore.collection('recipes').doc(id.toString()).set(recipe);
//         console.log(`Recipe with ID ${id} uploaded to Firestore.`);
//       } catch (error) {
//         console.error(`Error uploading recipe with ID ${id} to Firestore:`, error);
//       }
//     }
//   };
  
//   // Run the function to upload recipes to Firestore
//   uploadRecipesToFirestore();

// const additionalRecipes = [
//   {
//     id: "lkjHJG765dsF",
//     Ingredients: [
//       "Eggs",
//       "Butter",
//       "Salt",
//       "Pepper",
//       "Milk",
//     ],
//     Procedure: `
//       In a bowl, beat the eggs with milk, salt, and pepper.
//       Heat butter in a pan over medium heat.
//       Pour the egg mixture into the pan and continuously stir until eggs are fully cooked.
//       Serve the scrambled eggs hot and enjoy a quick and delicious breakfast!
//     `,
//     Name: "Scrambled Eggs",
//     Author: "Default",
//     Description: "A classic and easy-to-make breakfast dish with fluffy scrambled eggs."
//   },
//   {
//     id: "pOiUyT123qWe",
//     Ingredients: [
//       "Chicken Breast",
//       "Lettuce",
//       "Tomato",
//       "Mayonnaise",
//       "Bread",
//     ],
//     Procedure: `
//       Grill or cook the chicken breast until fully cooked.
//       Toast the bread slices.
//       Assemble the sandwich by placing lettuce, tomato, and grilled chicken between two slices of bread.
//       Spread mayonnaise on the bread for added flavor.
//       Cut the sandwich in half and enjoy a delicious chicken sandwich!
//     `,
//     Name: "Grilled Chicken Sandwich",
//     Author: "Default",
//     Description: "A hearty sandwich featuring grilled chicken, fresh veggies, and creamy mayonnaise."
//   },
//   {
//     id: "qWeRtY987uIo",
//     Ingredients: [
//       "Chocolate",
//       "Butter",
//       "Sugar",
//       "Eggs",
//       "Flour",
//     ],
//     Procedure: `
//       Melt chocolate and butter together.
//       In a separate bowl, whisk sugar and eggs until fluffy.
//       Combine the melted chocolate mixture with the sugar and egg mixture.
//       Gradually add flour and mix until smooth.
//       Pour the batter into a greased baking pan.
//       Bake in a preheated oven until a toothpick comes out clean.
//       Let it cool, then cut into squares and enjoy decadent chocolate brownies!
//     `,
//     Name: "Chocolate Brownies",
//     Author: "Default",
//     Description: "Indulge in rich and fudgy chocolate brownies for a delightful treat."
//   },
//   {
//     id: "mNbvCxZ123Az",
//     Ingredients: [
//       "Pasta",
//       "Olive Oil",
//       "Garlic",
//       "Cherry Tomatoes",
//       "Basil",
//       "Parmesan Cheese",
//     ],
//     Procedure: `
//       Cook the pasta according to package instructions.
//       In a pan, sauté minced garlic in olive oil until fragrant.
//       Add halved cherry tomatoes and cook until they start to soften.
//       Toss in the cooked pasta and fresh basil.
//       Sprinkle Parmesan cheese on top and serve this quick and flavorful Tomato Basil Pasta!
//     `,
//     Name: "Tomato Basil Pasta",
//     Author: "Default",
//     Description: "A simple and tasty pasta dish featuring fresh tomatoes, garlic, and basil."
//   },
//   {
//     id: "aSdFgH987bNh",
//     Ingredients: [
//       "Ground Beef",
//       "Onion",
//       "Tomato Sauce",
//       "Lasagna Noodles",
//       "Ricotta Cheese",
//       "Mozzarella Cheese",
//       "Parmesan Cheese",
//     ],
//     Procedure: `
//       In a pan, brown ground beef with diced onions.
//       Add tomato sauce and let it simmer.
//       In a baking dish, layer lasagna noodles, ricotta cheese, meat sauce, and mozzarella cheese.
//       Repeat the layers until the dish is full.
//       Top with Parmesan cheese and bake until bubbly and golden.
//       Allow it to cool slightly before serving this classic Beef Lasagna!
//     `,
//     Name: "Beef Lasagna",
//     Author: "Default",
//     Description: "A comforting and cheesy beef lasagna layered with pasta, ricotta, and mozzarella."
//   },
//   {
//     id: "zXcVbN123kLp",
//     Ingredients: [
//       "Shrimp",
//       "Lemon",
//       "Garlic",
//       "Butter",
//       "Parsley",
//       "Pasta",
//     ],
//     Procedure: `
//       Cook the pasta according to package instructions.
//       In a pan, sauté minced garlic in butter until fragrant.
//       Add shrimp and cook until they turn pink.
//       Squeeze lemon juice over the shrimp and toss with cooked pasta.
//       Garnish with chopped parsley and enjoy this quick and flavorful Lemon Garlic Shrimp Pasta!
//     `,
//     Name: "Lemon Garlic Shrimp Pasta",
//     Author: "Default",
//     Description: "A zesty and aromatic pasta dish featuring succulent shrimp, lemon, and garlic."
//   },
//   {
//     id: "oPlKiU098nBv",
//     Ingredients: [
//       "Avocado",
//       "Tomato",
//       "Red Onion",
//       "Cilantro",
//       "Lime Juice",
//       "Salt",
//     ],
//     Procedure: `
//       Dice avocado, tomato, and red onion.
//       Chop cilantro finely.
//       Combine all ingredients in a bowl.
//       Squeeze lime juice over the mixture and add salt to taste.
//       Gently toss everything together for a refreshing and nutritious Avocado Salsa!
//     `,
//     Name: "Avocado Salsa",
//     Author: "Default",
//     Description: "A vibrant and healthy salsa made with creamy avocados, tomatoes, and zesty lime juice."
//   },
//   {
//     id: "yHnJkL765tGb",
//     Ingredients: [
//       "Salmon Fillet",
//       "Lemon",
//       "Dill",
//       "Olive Oil",
//       "Salt",
//       "Pepper",
//     ],
//     Procedure: `
//       Preheat the oven and line a baking sheet with foil.
//       Place salmon fillet on the foil.
//       Drizzle olive oil over the salmon and season with salt, pepper, and fresh dill.
//       Lay lemon slices on top of the fillet.
//       Bake until the salmon is cooked through and flakes easily.
//       Serve with your favorite side dishes for a delicious Baked Lemon Dill Salmon!
//     `,
//     Name: "Baked Lemon Dill Salmon",
//     Author: "Default",
//     Description: "A light and flavorful baked salmon dish with zesty lemon and aromatic dill."
//   },
//   {
//     id: "qWeRtY098bNm",
//     Ingredients: [
//       "Ripe Bananas",
//       "Flour",
//       "Baking Soda",
//       "Butter",
//       "Brown Sugar",
//       "Eggs",
//       "Vanilla Extract",
//       "Chocolate Chips",
//     ],
//     Procedure: `
//       Preheat the oven and grease a baking pan.
//       In a bowl, mash ripe bananas.
//       In a separate bowl, cream butter and brown sugar.
//       Add eggs, vanilla extract, mashed bananas, and mix well.
//       In another bowl, whisk flour and baking soda.
//       Combine wet and dry ingredients, then fold in chocolate chips.
//       Pour the batter into the prepared pan and bake until golden.
//       Enjoy homemade Banana Chocolate Chip Bread!
//     `,
//     Name: "Banana Chocolate Chip Bread",
//     Author: "Default",
//     Description: "A delightful and moist banana bread studded with sweet chocolate chips for the perfect blend of flavors."

//   },
// {
// id: "hGfReD876cXv",
// Ingredients: [
// "Chicken Thighs",
// "Soy Sauce",
// "Honey",
// "Garlic",
// "Ginger",
// "Green Onions",
// ],
// Procedure: "In a bowl, mix soy sauce, honey, minced garlic, and grated ginger. Marinate chicken thighs in the sauce for at least 30 minutes. Grill or roast the chicken until fully cooked. Garnish with chopped green onions before serving. Enjoy this savory and sticky Honey Garlic Chicken!" ,
// Name: "Honey Garlic Chicken",
// Author: "Default",
// Description: "A flavorful and succulent chicken dish featuring a sweet and savory honey garlic glaze."
// },
// {
// id: "aSdFgH765nBg",
// Ingredients: [
// "Rice",
// "Black Beans",
// "Corn",
// "Tomatoes",
// "Avocado",
// "Cilantro",
// "Lime Juice",
// "Cumin",
// "Salt",
// ],
// Procedure: "Cook rice according to package instructions. In a bowl, combine cooked rice, black beans, corn, diced tomatoes, and chopped avocado. Add chopped cilantro, lime juice, cumin, and salt to taste. Toss everything together for a refreshing and satisfying Black Bean and Corn Salad!" ,
// Name: "Black Bean and Corn Salad",
// Author: "Default",
// Description: "A colorful and nutritious salad with a mix of black beans, corn, and fresh vegetables."
// },
// {
// id: "mNbvCxZ876Az",
// Ingredients: [
// "Pineapple",
// "Chicken Breast",
// "Bell Peppers",
// "Onion",
// "Soy Sauce",
// "Garlic",
// "Ginger",
// ],
// Procedure: "Cut chicken breast into bite-sized pieces. In a pan, sauté minced garlic and ginger in soy sauce. Add chicken and cook until browned. Stir in pineapple chunks, bell peppers, and diced onions. Cook until the chicken is fully cooked and the vegetables are tender. Serve this sweet and savory Pineapple Chicken Stir-Fry over rice." ,
// Name: "Pineapple Chicken Stir-Fry",
// Author: "Default",
// Description: "A delicious stir-fry with tender chicken, sweet pineapple, and colorful vegetables."
// }
// ];

// const uploadAdditionalRecipesToFirestore = async () => {
//   const firestore = admin.firestore();

//   for (const recipe of additionalRecipes) {
//     const { id, ...recipeData } = recipe;

//     try {
//       // Set the recipe data in Firestore with the specified ID
//       await firestore.collection('recipes').doc(id.toString()).set(recipe);
//       console.log(`Recipe with ID ${id} uploaded to Firestore.`);
//     } catch (error) {
//       console.error(`Error uploading recipe with ID ${id} to Firestore:`, error);
//     }
//   }
// };

// // Run the function to upload additional recipes to Firestore
// uploadAdditionalRecipesToFirestore();




// const recipes = [
//   {
//     id: "02d1asA98SD2a4",
//     Ingredients: [
//       "Paneer",
//       "Tomatoes",
//       "Onions",
//       "Ginger",
//       "Garlic",
//       "Green Chilies",
//       "Cashews",
//       "Garam Masala",
//       "Cream",
//       "Kasuri Methi",
//       "Oil",
//       "Spices",
//     ],
//     Procedure: `
//       Start by sautéing onions, ginger, and garlic in oil until golden brown.
//       Add tomatoes, green chilies, and cashews. Cook until tomatoes are soft and everything blends well.
//       Let the mixture cool, then blend it into a smooth paste.
//       In the same pan, heat oil and add the blended paste. Cook until it leaves the sides.
//       Add garam masala, cream, and kasuri methi. Cook until the mixture thickens.
//       Finally, add paneer cubes and cook until the paneer is well-coated and cooked.
//       Garnish with fresh coriander and serve hot with naan or rice.
//     `,
//     Name: "Paneer Butter Masala",
//     Author: "Default",
//     Description: "A rich and creamy Indian dish featuring paneer cubes in a flavorful tomato-based gravy."
//   },
//   {
//     id: "02d1asA98SD2a5",
//     Ingredients: [
//       "Chickpeas",
//       "Onions",
//       "Tomatoes",
//       "Ginger",
//       "Garlic",
//       "Green Chilies",
//       "Cumin",
//       "Coriander",
//       "Turmeric",
//       "Garam Masala",
//       "Oil",
//       "Cilantro",
//     ],
//     Procedure: `
//       Start by sautéing onions, ginger, and garlic in oil until golden brown.
//       Add tomatoes, green chilies, and spices. Cook until tomatoes are soft and everything blends well.
//       Let the mixture cool, then blend it into a smooth paste.
//       In the same pan, heat oil and add the blended paste. Cook until it leaves the sides.
//       Add boiled chickpeas, garam masala, and water. Simmer until the curry thickens.
//       Garnish with cilantro and serve hot with rice or naan.
//     `,
//     Name: "Chana Masala",
//     Author: "Default",
//     Description: "A classic Indian dish featuring chickpeas in a spiced tomato-based curry."
//   },
//   {
//     id: "02d1asA98SD2a6",
//     Ingredients: [
//       "Potatoes",
//       "Cauliflower",
//       "Peas",
//       "Onions",
//       "Tomatoes",
//       "Ginger",
//       "Garlic",
//       "Turmeric",
//       "Red Chili Powder",
//       "Garam Masala",
//       "Oil",
//       "Cilantro",
//     ],
//     Procedure: `
//       Start by sautéing onions, ginger, and garlic in oil until golden brown.
//       Add tomatoes, turmeric, and red chili powder. Cook until tomatoes are soft.
//       Add diced potatoes, cauliflower florets, and peas. Mix well to coat with spices.
//       Cover and cook until the vegetables are tender.
//       Sprinkle garam masala and garnish with cilantro before serving.
//       Serve hot with roti or rice.
//     `,
//     Name: "Aloo Gobi",
//     Author: "Default",
//     Description: "A flavorful vegetarian dish featuring potatoes and cauliflower in aromatic spices."
//   },
//   {
//     id: "02d1asA98SD2a7",
//     Ingredients: [
//       "Lentils",
//       "Onions",
//       "Tomatoes",
//       "Ginger",
//       "Garlic",
//       "Cumin",
//       "Turmeric",
//       "Red Chili Powder",
//       "Garam Masala",
//       "Oil",
//       "Cilantro",
//     ],
//     Procedure: `
//       Boil lentils until soft and set aside.
//       Sauté onions, ginger, and garlic in oil until golden brown.
//       Add tomatoes, cumin, turmeric, and red chili powder. Cook until tomatoes are soft.
//       Add boiled lentils and simmer until the curry thickens.
//       Sprinkle garam masala and garnish with cilantro before serving.
//       Serve hot with rice or naan.
//     `,
//     Name: "Dal Tadka",
//     Author: "Default",
//     Description: "A comforting lentil curry with aromatic tempering, perfect for a hearty meal."
//   },
//   {
//     id: "02d1asA98SD2a8",
//     Ingredients: [
//       "Hilsa Fish",
//       "Mustard Oil",
//       "Turmeric",
//       "Green Chilies",
//       "Mustard Seeds",
//       "Poppy Seeds",
//       "Yogurt",
//       "Salt",
//     ],
//     Procedure: `
//       Clean and marinate Hilsa fish with turmeric and salt.
//       In a bowl, mix mustard and poppy seed paste with yogurt.
//       Heat mustard oil in a pan, add green chilies, and sauté the mustard-poppy seed paste.
//       Add marinated fish and cook until done.
//       Serve hot with steamed rice.
//     `,
//     Name: "Ilish Bhapa",
//     Author: "Default",
//     Description: "A traditional Bengali dish featuring Hilsa fish marinated in mustard-poppy seed paste."
//   },
//   {
//     id: "02d1asA98SD2a10",
//     Ingredients: [
//       "Paneer",
//       "Bell Peppers",
//       "Onions",
//       "Tomatoes",
//       "Ginger",
//       "Garlic",
//       "Cumin Seeds",
//       "Coriander Powder",
//       "Turmeric",
//       "Red Chili Powder",
//       "Garam Masala",
//       "Fresh Cream",
//       "Kasuri Methi",
//       "Salt",
//       "Oil",
//     ],
//     Procedure: `
//       Cut paneer and vegetables into cubes.
//       In a pan, heat oil, add cumin seeds, and sauté ginger-garlic paste.
//       Add chopped onions and cook until golden brown.
//       Add tomatoes, spices, and cook until the oil separates.
//       Add paneer, bell peppers, and cook until the vegetables are tender.
//       Finish with fresh cream, kasuri methi, and salt.
//       Serve hot with naan or rice.
//     `,
//     Name: "Paneer Tikka Masala",
//     Author: "Default",
//     Description: "A popular Indian vegetarian dish with marinated paneer in a creamy tomato-based sauce."
//   },
//   {
//     id: "02d1asA98SD2a11",
//     Ingredients: [
//       "Chicken",
//       "Yogurt",
//       "Ginger",
//       "Garlic",
//       "Red Chili Powder",
//       "Turmeric",
//       "Garam Masala",
//       "Lemon Juice",
//       "Salt",
//       "Oil",
//     ],
//     Procedure: `
//       Marinate chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, garam masala, lemon juice, and salt.
//       Let it marinate for at least 2 hours or overnight.
//       Preheat the grill or oven.
//       Thread the marinated chicken onto skewers and grill until fully cooked.
//       Serve hot with mint chutney.
//     `,
//     Name: "Chicken Tikka",
//     Author: "Default",
//     Description: "A popular Indian appetizer featuring marinated and grilled chicken skewers."
//   },
//   {
//     id: "02d1asA98SD2a12",
//     Ingredients: [
//       "Chicken",
//       "Onions",
//       "Tomatoes",
//       "Ginger",
//       "Garlic",
//       "Green Chilies",
//       "Cumin Powder",
//       "Coriander Powder",
//       "Turmeric",
//       "Red Chili Powder",
//       "Garam Masala",
//       "Fresh Coriander",
//       "Oil",
//       "Salt",
//     ],
//     Procedure: `
//       Heat oil in a pan and sauté chopped onions until golden brown.
//       Add ginger-garlic paste and green chilies, sauté until the raw smell disappears.
//       Add chopped tomatoes, cumin powder, coriander powder, turmeric, red chili powder, and salt.
//       Cook the masala until the oil separates from the mixture.
//       Add chicken pieces and cook until they are well-coated with the masala.
//       Pour in water, cover, and simmer until the chicken is cooked through.
//       Sprinkle garam masala and garnish with fresh coriander.
//       Serve hot with rice or naan.
//     `,
//     Name: "Chicken Curry",
//     Author: "Default",
//     Description: "A classic Indian chicken curry with aromatic spices and a rich, flavorful gravy."
//   },
//   {
//     id: "02d1asA98SD2a13",
//     Ingredients: [
//       "Chicken",
//       "Yogurt",
//       "Ginger-Garlic Paste",
//       "Kasuri Methi",
//       "Cream",
//       "Cashews",
//       "Tomato Puree",
//       "Onions",
//       "Green Chilies",
//       "Coriander Powder",
//       "Turmeric",
//       "Red Chili Powder",
//       "Garam Masala",
//       "Oil",
//       "Salt",
//     ],
//     Procedure: `
//       Marinate chicken with yogurt, ginger-garlic paste, kasuri methi, and salt. Let it marinate for at least 30 minutes.
//       In a blender, blend cashews and tomato puree to make a smooth paste.
//       Heat oil in a pan, sauté chopped onions and green chilies until golden brown.
//       Add the cashew-tomato paste, coriander powder, turmeric, red chili powder, and salt. Cook until the oil separates.
//       Add marinated chicken and cook until it's almost done.
//       Pour in cream, sprinkle garam masala, and simmer until the chicken is fully cooked.
//       Garnish with fresh coriander and serve hot with naan or rice.
//     `,
//     Name: "Butter Chicken",
//     Author: "Default",
//     Description: "A rich and creamy Indian chicken dish with a delicious tomato-cashew gravy."
//   },

// ];



// const uploadRecipesToFirestore = async () => {
//     const firestore = admin.firestore();
  
//     for (const recipe of recipes) {
//       const { id, ...recipeData } = recipe;
  
//       try {
//         // Set the recipe data in Firestore with the specified ID
//         await firestore.collection('recipes').doc(id.toString()).set(recipe);
//         console.log(`Recipe with ID ${id} uploaded to Firestore.`);
//       } catch (error) {
//         console.error(`Error uploading recipe with ID ${id} to Firestore:`, error);
//       }
//     }
//   };
  
//   // Run the function to upload recipes to Firestore
//   uploadRecipesToFirestore();