const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meals-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("show");
});

function getMealList() {
  let searchInputText = document.getElementById("search-input").value.trim();

  if (!searchInputText) {
    mealList.innerHTML =
      "<p>Please, type an ingredient to search for recipes!</p>";
    mealList.classList.add("notFound");
    return;
  }
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`
  ).then((response) => {
    response.json().then((data) => {
      let html = "";
      mealList.classList.remove("notFound");

      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="Food Image" />
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <button  class="recipe-btn" >View Recipe</button>
                    </div>
                </div>
                `;
        });
      } else {
        mealList.classList.add("notFound");
        html = "Sorry, we didn't find any meal! :(";
      }

      mealList.innerHTML = html;
    });
  });
}

function getMealRecipe(e) {
  e.preventDefault();

  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;

    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.meals);
        mealRecipeModal(data.meals); // precisa implementar essa função
      })
      .catch((error) => console.error("Erro ao buscar receita:", error));
  }
}

function mealRecipeModal(meal) {
  meal = meal[0];

  let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
            <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="Food Image">
            </div>
        </div>
  `;

  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("show");
}
