/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");
const adminLink = document.getElementById("admin-link");
const searchInput = document.getElementById("search-input");
const addIngredientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.addEventListener("click", addIngredient);
deleteIngredientButton.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
window.onload = getIngredients;

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const name = addIngredientNameInput.value;
    if (!name) {
        alert("Please enter name to add ingredient!");
        return;
    }

    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            addIngredientNameInput.value = "";
            await getIngredients();
            refreshIngredientList();
        } else {
            alert("Failed to add ingredient.");
        }
    } catch (err) {
        console.error("Add Error:", err);
        alert("An error occurred.");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/ingredients`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        }
    } catch (err) {
        console.error("Get Error:", err);
        alert("An error occurred.");
    }
}

/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const name = deleteIngredientNameInput.value;
    if (!name) {
        alert("Please enter name to delete ingredient!");
        return;
    }

    const ingredientToDelete = ingredients.find(ing => ing.name.toLowerCase() === name.toLowerCase());
    if (!ingredientToDelete) {
        alert("Unable to find ingredient");
        return;
    }

    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/ingredients/${ingredientToDelete.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            deleteIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient.");
        }
    } catch (error) {
        console.error("Delete Error:", err);
        alert("An error occurred.");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
