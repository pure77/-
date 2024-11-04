document.addEventListener("DOMContentLoaded", function () {
    const categoryListElement = document.getElementById("categoryList");
    const editModal = document.getElementById("editModal");
    const editCategoryInput = document.getElementById("editCategoryInput");
    let currentCategoryIndex = null;
  
    // Load categories from localStorage and display them
    function loadCategories() {
      const categories = JSON.parse(localStorage.getItem("categories")) || [];
      categoryListElement.innerHTML = ""; // Clear current list
  
      categories.forEach((category, index) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-item");
        categoryDiv.innerHTML = `
          <span>${category.title}</span>
          <div class="category-actions">
            <button onclick="editCategory(${index})">수정</button>
            <button onclick="deleteCategory(${index})">삭제</button>
          </div>
        `;
  
        categoryListElement.appendChild(categoryDiv);
      });
    }
  
    // Edit category
    window.editCategory = function (index) {
      const categories = JSON.parse(localStorage.getItem("categories")) || [];
      currentCategoryIndex = index;
      editCategoryInput.value = categories[index].title;
      editModal.style.display = "flex"; // Show modal
    };
  
    // Save edited category
    document.getElementById("saveEditBtn").addEventListener("click", function () {
      const categories = JSON.parse(localStorage.getItem("categories")) || [];
      categories[currentCategoryIndex].title = editCategoryInput.value;
      localStorage.setItem("categories", JSON.stringify(categories));
      editModal.style.display = "none"; // Hide modal
      loadCategories(); // Refresh category list
    });
  
    // Cancel edit
    document.getElementById("cancelEditBtn").addEventListener("click", function () {
      editModal.style.display = "none"; // Hide modal
    });
  
    // Delete category
    window.deleteCategory = function (index) {
      const categories = JSON.parse(localStorage.getItem("categories")) || [];
      categories.splice(index, 1); // Remove category from array
      localStorage.setItem("categories", JSON.stringify(categories));
      loadCategories(); // Refresh category list
    };
  
    // Initial load of categories
    loadCategories();
  });
  