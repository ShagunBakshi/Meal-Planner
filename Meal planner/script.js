 const Meal_Plan_API = "https://content.newtonschool.co/v1/pr/64995a40e889f331d43f70ae/categories";

 const Generate_Recipe_API = "https://content.newtonschool.co/v1/pr/64996337e889f331d43f70ba/recipes";

 const weight = document.getElementById("weight-input");
 const height = document.getElementById("height-input");  
 const age = document.getElementById("age-input");
 const gender = document.getElementById("gender-input");
 const physicalActivity = document.getElementById("physical-activity-input");
 const submitButton = document.getElementById("submit-button");
 let bmr;
 let dailyCalorieRequirement;
 let breakfast;
 let lunch;
 let dinner;
let mealName;

// Here we are calculating the bmr and the calorie requirements.
submitButton.addEventListener("click", (e) => {
    e.preventDefault(); 
    const weightValue = parseInt(weight.value);
    const heightValue = parseInt(height.value);
    const ageValue = parseInt(age.value);
    const genderValue = gender.value;
    const physicalActivityValue = physicalActivity.value; 

    if (genderValue === "male" && weightValue > 0 && heightValue > 0 && ageValue > 0 && weightValue != NaN && heightValue != NaN && ageValue != NaN ) {
        bmr = 66.47 + (13.75 * weightValue) + (5.003 * heightValue) - (6.755 * ageValue);
      } else if (genderValue === "female" && weightValue > 0 && heightValue > 0 && ageValue > 0 && weightValue != NaN && heightValue != NaN && ageValue != NaN) {
        bmr =  655.1 + (9.563 * weightValue) + (1.850 * heightValue) - (4.676 * ageValue);
      }else{
        alert("Please Enter Valid Details")
      }
     
    if(physicalActivityValue === "light"){
        dailyCalorieRequirement = bmr * 1.375;
    } else if(physicalActivityValue === "moderate"){
        dailyCalorieRequirement = bmr * 1.55;
    } else if ( physicalActivityValue === "active"){
        dailyCalorieRequirement = bmr * 1.725;
    }

     
generateMealPlan(dailyCalorieRequirement);
})

// Here we are getting the response from the API to fetch the meal cards
async function generateMealPlan(dailyCalorieRequirement){
    const data = await fetch(Meal_Plan_API);
    let response = await data.json();

    response.forEach((dailyMeal) => {
        let minCalorie = dailyMeal['min'];
        let maxCalorie = dailyMeal['max'];
        
        breakfast = dailyMeal['breakfast'];
        lunch = dailyMeal['lunch'];
        dinner = dailyMeal['dinner'];
        
        // Here we are checking the condition of calorie requirement
    if(dailyCalorieRequirement >= minCalorie &&         dailyCalorieRequirement <= maxCalorie){
        const mealPlanCard = document.getElementById("meal-plan");
        
        const div = document.createElement("div");
        div.setAttribute("id","meal-plan-div");

        // Here the UI is being cleared so that only 3 cards will be there at one click.
        mealPlanCard.innerHTML = "";

        // Here we are storing the function in the variable and in the function we have passed the breakfast/lunch/dinner object from the API
        const breakfastCard = getMealPlanCard(breakfast);
        const lunchCard = getMealPlanCard(lunch);
        const dinnerCard = getMealPlanCard(dinner);

        // Here we have concatenated all the cards together and then we will pass these cards in the div which we have created.
        const allMealCard = `${breakfastCard} ${lunchCard} ${dinnerCard}`
        div.innerHTML = allMealCard;
        mealPlanCard.appendChild(div);     

    }
})
}

// Here we are making the cards to be shown on the UI
function getMealPlanCard(meal){
      const mealCard = `  
        <div class="card">
            <img src="${meal.image}" alt="${meal.title}" class="food-image" />
            <h2 class="meal-name">${meal.title}</h2>
            <button class="get-recipe-button" onclick = "getRecipe(${meal.id})">Get Recipe</button>        
    </div>`
    return mealCard;   
}

// This function is calling the API to get the recipe of the food items
async function getRecipe(mealId){
    const data = await fetch(Generate_Recipe_API);
    let response = await data.json();
    
    console.log(mealId)
    populateRecipeDetails({mealId,response}) 
}

// Here the recipe is being populated on the UI.
function populateRecipeDetails({mealId,response}){
    // This is used to match the meal card and the meal recipe
    const recipe = response.find((x) => x.id === mealId )
    const recipeSection = document.getElementById("recipe-section");
     recipeSection.innerHTML =  `
        <h2 id="meal-title">${recipe.title}</h2>   
                <h3 id= "ingredients">Recipe:<br/>${recipe.ingredients}</h3>
                <h3 id="steps">Steps:<br/>${recipe.steps}</h3>
                <ul id="steps-list" class="list-items">         
        `
        body.appendChild(recipeSection)
}

     

