document.getElementById("fetch-recipe").addEventListener("click", fetchRecipe);

// Fetch available categories from the API
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(response => response.json())
  .then(data => {
    const categorySelect = document.getElementById('category');
    const categories = data.categories;

    // Clear existing options and add valid categories
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.strCategory;
      option.textContent = category.strCategory;
      categorySelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching categories:', error);
  });

function fetchRecipe() {
  const category = document.getElementById("category").value; // Get selected category
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`; // URL to fetch recipes based on category

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.meals && data.meals.length > 0) {
        // Randomly select a recipe from the category
        const randomRecipe = data.meals[Math.floor(Math.random() * data.meals.length)];
        displayRecipe(randomRecipe);
      } else {
        alert(`No recipes found for the "${category}" category.`);
      }
    })
    .catch(error => {
      console.error('Error fetching recipe:', error);
      alert("Sorry, there was an error fetching the recipe.");
    });
}

function displayRecipe(recipe) {
  // Display recipe name, image, and instructions
  document.getElementById("recipe-name").textContent = recipe.strMeal;
  const recipeImage = document.getElementById("recipe-image");
  recipeImage.src = recipe.strMealThumb;
  recipeImage.style.display = "block";

  // Fetch detailed instructions and ingredients for the selected recipe
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`)
    .then(response => response.json())
    .then(data => {
      const recipeDetails = data.meals[0];
      document.getElementById("recipe-instructions").textContent = recipeDetails.strInstructions;
      
      // Display ingredients
      const ingredientsList = document.getElementById("ingredients-list");
      ingredientsList.innerHTML = ""; // Clear previous ingredients

      for (let i = 1; i <= 20; i++) {
        const ingredient = recipeDetails[`strIngredient${i}`];
        const measure = recipeDetails[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== "") {
          const listItem = document.createElement('li');
          listItem.textContent = `${measure} ${ingredient}`;
          ingredientsList.appendChild(listItem);
        }
      }

      document.getElementById("recipe-container").style.display = "block"; // Show the recipe
    })
    .catch(error => {
      console.error('Error fetching instructions:', error);
      alert("Sorry, there was an error fetching the recipe details.");
    });
}
