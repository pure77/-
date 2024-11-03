const daysContainer = document.getElementById("days");
const monthHeader = document.querySelector(".month-header span");
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let categories = [];
let todos = {};

// Array of month names for display
const monthNames = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

// Function to render the calendar for the current month and year
function updateCalendar() {
  monthHeader.textContent = `${currentYear}년 ${monthNames[currentMonth]}`;
  daysContainer.innerHTML = "";
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Fill empty slots for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptysection = document.createElement("section");
    daysContainer.appendChild(emptysection);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const daysection = document.createElement("section");
    daysection.classList.add("day");
    daysection.textContent = day;
    daysection.onclick = () => selectDay(daysection, day);

    // Highlight today's date
    if (
      day === currentDate.getDate() &&
      currentMonth === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear()
    ) {
      daysection.classList.add("selected");
    }

    daysContainer.appendChild(daysection);
  }
}

// Function to handle day selection
function selectDay(selectedDay, day) {
  document
    .querySelectorAll(".day")
    .forEach((day) => day.classList.remove("selected"));
  selectedDay.classList.add("selected");
  renderCategoriesForDay(day);
}

// Function to navigate to the previous month
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar();
}

// Function to navigate to the next month
function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
}

// Function to add a new category
function addCategory() {
  const categoryName = prompt("Enter category name:");
  if (categoryName) {
    const category = { name: categoryName };
    categories.push(category);
    renderCategories();
  }
}

// Function to render the list of categories
function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  categories.forEach((category, index) => {
    const categorysection = document.createElement("section");
    categorysection.classList.add("category");

    const categoryName = document.createElement("span");
    categoryName.classList.add("category-name");
    categoryName.textContent = category.name;
    categorysection.appendChild(categoryName);

    const icon = document.createElement("span");
    icon.classList.add("category-icon");
    icon.textContent = "🔒";
    categorysection.appendChild(icon);

    categorysection.onclick = () => openTodoList(index);
    categoryList.appendChild(categorysection);
  });
}

// Function to render categories and to-dos for a selected day
function renderCategoriesForDay(day) {
  if (!todos[currentYear]) todos[currentYear] = {};
  if (!todos[currentYear][currentMonth]) todos[currentYear][currentMonth] = {};
  if (!todos[currentYear][currentMonth][day])
    todos[currentYear][currentMonth][day] = {};

  categories.forEach((_, index) => {
    const dayTodos = todos[currentYear][currentMonth][day][index] || [];
    todos[currentYear][currentMonth][day][index] = dayTodos;

    console.log(
      `Category: ${categories[index].name}, Todos for Day ${day}:`,
      dayTodos
    );
  });
}

// Function to open and manage to-do list for a selected day and category
function openTodoList(categoryIndex) {
  const selectedDay = document.querySelector(".day.selected");
  if (!selectedDay) {
    alert("Please select a day first!");
    return;
  }

  const day = parseInt(selectedDay.textContent);

  if (!todos[currentYear][currentMonth][day][categoryIndex]) {
    todos[currentYear][currentMonth][day][categoryIndex] = [];
  }

  const todoText = prompt("Enter a new to-do item:");
  if (todoText) {
    todos[currentYear][currentMonth][day][categoryIndex].push(todoText);
    alert(
      `Added "${todoText}" to ${
        categories[categoryIndex].name
      } on ${currentYear}-${currentMonth + 1}-${day}`
    );
  }
}
const menu = document.getElementById("navbarMenu");
const menuIcon = document.getElementById("menuIcon");

function positionMenu() {
  // Get the icon's position
  const iconRect = menuIcon.getBoundingClientRect();

  // Position the menu below the icon
  menu.style.top = `${iconRect.bottom + window.scrollY}px`;
  menu.style.left = `${iconRect.left + window.scrollX}px`;
}

function toggleMenu() {
  menu.classList.toggle("show"); // Toggle the 'show' class to show/hide the menu

  if (menu.classList.contains("show")) {
    // Position the menu when it becomes visible
    positionMenu();
  }
}

// Reposition the menu on window resize if it is open
window.addEventListener("resize", () => {
  if (menu.classList.contains("show")) {
    positionMenu();
  }
});

// Close the menu if clicked outside of it
window.onclick = function (event) {
  if (
    !menu.contains(event.target) &&
    event.target !== menuIcon &&
    !menuIcon.contains(event.target)
  ) {
    menu.classList.remove("show"); // Hide the menu
  }
};

// Initialize the calendar
updateCalendar();
