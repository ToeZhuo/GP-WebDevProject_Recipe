/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const recipeList = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const addNameInput = document.getElementById("add-recipe-name-input");
    const addInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addSubmitButton = document.getElementById("add-recipe-submit-input");
    const updateNameInput = document.getElementById("update-recipe-name-input");
    const updateInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateSubmitButton = document.getElementById("update-recipe-submit-input");
    const deleteNameInput = document.getElementById("delete-recipe-name-input");
    const deleteSubmitButton = document.getElementById("delete-recipe-submit-input");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    const token = sessionStorage.getItem("auth-token");
    if (token) {
        logoutButton.style.display = "inline-block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    const isAdmin = sessionStorage.getItem("is-admin");
    if (isAdmin === "true") {
        adminLink.style.display = "inline-block";
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    searchButton.addEventListener("click", searchRecipes);
    addSubmitButton.addEventListener("click", addRecipe);
    updateSubmitButton.addEventListener("click", updateRecipe);
    deleteSubmitButton.addEventListener("click", deleteRecipe);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    window.onload = getRecipes;

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        try {
            const term = searchInput.value;
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(term)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                alert("Failed to search recipes.");
            }
        } catch (err) {
            console.error("Search Error:", err);
            alert("An error occurred.");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addNameInput.value;
        const instructions = addInstructionsInput.value;

        if (!name || !instructions) {
            alert("Please enter both name and instructions!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, instructions })
            });

            if (response.ok) {
                addNameInput.value = "";
                addInstructionsInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to add recipe.");
            }
        } catch (err) {
            console.error("Add Error:", err);
            alert("An error occurred.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateNameInput.value;
        const instructions = updateInstructionsInput.value;

        if (!name || !instructions) {
            alert("Please enter both name and new instructions!");
            return;
        }

        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipe) {
            alert("Unable to find recipe!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, instructions })
            });

            if (response.ok) {
                updateNameInput.value = "";
                updateInstructionsInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to update recipe.");
            }
        } catch (err) {
            console.error("Update Error:", err);
            alert("An error occurred.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteNameInput.value;

        if (!name) {
            alert("Please enter the recipe name to delete!");
            return;
        }

        const recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipe) {
            alert("Unable to find recipe!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                deleteNameInput.value = "";
                await getRecipes();
            } else {
                alert("Failed to delete recipe.");
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert("An error occurred.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                alert("Failed to get recipes.");
            }
        } catch (err) {
            console.error("Get Error:", err);
            alert("An error occurred.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                sessionStorage.clear();
                alert("Logged out successfully!");
                window.location.href = "../login/login.html";
            } else {
                alert("Logout failed.");
            }
        } catch (err) {
            console.error("Logout Error:", err);
            alert("An error occurred.");
        }
    }

});
