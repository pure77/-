const daysContainer = document.getElementById("days");
const monthHeader = document.querySelector(".month-header span");
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDay = currentDate.getDate();
let categories = [];
let todos = {}; // Object to store tasks by date

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

  // Get the first day of the month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Adjust for the correct start of the month (fixing weekday misalignment)
  for (let i = 0; i < firstDay; i++) {
    const emptySection = document.createElement("section");
    daysContainer.appendChild(emptySection);
  }

  // Render all the days for the month
  for (let day = 1; day <= daysInMonth; day++) {
    const daySection = document.createElement("section");
    daySection.classList.add("day");
    daySection.textContent = day;
    daySection.onclick = () => selectDay(daySection, day);

    // Highlight today's date
    if (
      day === currentDate.getDate() &&
      currentMonth === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear()
    ) {
      daySection.classList.add("selected");
    }

    daysContainer.appendChild(daySection);
  }
}

function selectDay(selectedDayElement, day) {
  document
    .querySelectorAll(".day")
    .forEach((dayElement) => dayElement.classList.remove("selected"));
  selectedDayElement.classList.add("selected");

  selectedDay = day;
  renderCategoriesForDay();
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
}

function loadCategories() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";
  categories = JSON.parse(localStorage.getItem("categories")) || [];

  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-item");
    categoryDiv.innerHTML = `
      <span>${category.title}</span>
      <button class="addTaskButton">+</button>
      <div class="taskList"></div>
    `;

    categoryDiv
      .querySelector(".addTaskButton")
      .addEventListener("click", function () {
        const taskList = categoryDiv.querySelector(".taskList");
        addTask(taskList, category.title);
      });

    categoryList.appendChild(categoryDiv);
  });
}

function renderCategoriesForDay() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-item");
    categoryDiv.innerHTML = `
      <span>${category.title}</span>
      <button class="addTaskButton">+</button>
      <div class="taskList"></div>
    `;

    const taskList = categoryDiv.querySelector(".taskList");
    const dateKey = getDateKey(currentYear, currentMonth, selectedDay);
    const monthKey = `${currentYear}-${currentMonth + 1}`;
    const weekKey = getWeekKey(currentYear, currentMonth, selectedDay);

    let tasks = [];

    if (category.title === "Month") {
      tasks = (todos[monthKey] && todos[monthKey][category.title]) || [];
    } else if (category.title === "Week") {
      tasks = (todos[weekKey] && todos[weekKey][category.title]) || [];
    } else {
      tasks = (todos[dateKey] && todos[dateKey][category.title]) || [];
    }

    tasks.forEach((task) => {
      const taskItem = createTaskElement(task, category.title, dateKey);
      taskList.appendChild(taskItem);
    });

    categoryDiv.querySelector(".addTaskButton").onclick = () =>
      addTask(taskList, category.title);

    categoryList.appendChild(categoryDiv);
  });
}

function addTask(taskList, categoryTitle) {
  const taskItem = createTaskElement(
    "",
    categoryTitle,
    getDateKey(currentYear, currentMonth, selectedDay)
  );
  const taskInput = taskItem.querySelector(".task-input");

  let isTaskSaved = false;

  const saveTaskHandler = () => {
    if (taskInput.value.trim() !== "" && !isTaskSaved) {
      isTaskSaved = true;
      saveTask(categoryTitle, taskInput.value.trim());
      renderCategoriesForDay();
      taskInput.value = "";
    }
  };

  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      saveTaskHandler();
    }
  });

  taskInput.addEventListener("blur", saveTaskHandler);
  taskList.appendChild(taskItem);
}

function createTaskElement(taskText, categoryTitle, dateKey) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.innerHTML = `
    <input type="checkbox" class="task-checkbox" />
    <input type="text" value="${taskText}" placeholder="할 일 입력" class="task-input" />
    <button class="delete-task-button">삭제</button>
  `;

  const taskInput = taskItem.querySelector(".task-input");
  const deleteButton = taskItem.querySelector(".delete-task-button");

  taskInput.addEventListener("blur", () => {
    if (taskInput.value.trim() !== "") {
      taskInput.classList.add("completed");
    }
  });

  deleteButton.addEventListener("click", () => {
    deleteTask(categoryTitle, taskText, dateKey);
    renderCategoriesForDay();
  });

  return taskItem;
}
// Add task function for Month section
function addMonthTask() {
  const monthTaskList = document.getElementById("monthTaskList");
  addTask(monthTaskList); // Call addTask with the correct task list
}

// Add task function for Week section
function addWeekTask() {
  const weekTaskList = document.getElementById("weekTaskList");
  addTask(weekTaskList); // Call addTask with the correct task list
}

// Load categories on page load
window.onload = loadCategories;

// Hook up the buttons in Month/Week section to the add task functions
document
  .querySelectorAll(".month_week-container .addTaskButton")
  .forEach((button) => {
    button.addEventListener("click", (event) => {
      const categoryTitle = event.target
        .closest(".category-item")
        .querySelector("span").innerText;
      const taskList =
        categoryTitle === "Month"
          ? document.getElementById("monthTaskList")
          : document.getElementById("weekTaskList");
      addTask(taskList, categoryTitle);
    });
  });
function saveTask(categoryTitle, taskText) {
  const dateKey = getDateKey(currentYear, currentMonth, selectedDay);
  const monthKey = `${currentYear}-${currentMonth + 1}`; // key for the month
  const weekKey = getWeekKey(currentYear, currentMonth, selectedDay); // key for the week

  todos[dateKey] = todos[dateKey] || {};
  todos[monthKey] = todos[monthKey] || {};
  todos[weekKey] = todos[weekKey] || {};

  if (categoryTitle === "Month") {
    todos[monthKey][categoryTitle] = todos[monthKey][categoryTitle] || [];
    todos[monthKey][categoryTitle].push(taskText);
  } else if (categoryTitle === "Week") {
    todos[weekKey][categoryTitle] = todos[weekKey][categoryTitle] || [];
    todos[weekKey][categoryTitle].push(taskText);
  } else {
    todos[dateKey][categoryTitle] = todos[dateKey][categoryTitle] || [];
    todos[dateKey][categoryTitle].push(taskText);
  }

  localStorage.setItem("todos", JSON.stringify(todos));
}
function getWeekKey(year, month, day) {
  const date = new Date(year, month, day);
  const startOfYear = new Date(year, 0, 1);
  const daysSinceStart = Math.floor(
    (date - startOfYear) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil((daysSinceStart + 1) / 7);
  return `${year}-W${weekNumber}`;
}
function deleteTask(categoryTitle, taskText, dateKey) {
  let key;

  if (categoryTitle === "Month") {
    key = `${currentYear}-${currentMonth + 1}`; // monthKey
  } else if (categoryTitle === "Week") {
    key = getWeekKey(currentYear, currentMonth, selectedDay); // weekKey
  } else {
    key = dateKey;
  }

  if (todos[key] && todos[key][categoryTitle]) {
    todos[key][categoryTitle] = todos[key][categoryTitle].filter(
      (task) => task !== taskText
    );

    if (todos[key][categoryTitle].length === 0) {
      delete todos[key][categoryTitle];
    }

    if (Object.keys(todos[key]).length === 0) {
      delete todos[key];
    }

    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function getDateKey(year, month, day) {
  return `${year}-${month + 1}-${day}`;
}

const menu = document.getElementById("navbarMenu");
const menuIcon = document.getElementById("menuIcon");

function positionMenu() {
  const iconRect = menuIcon.getBoundingClientRect();
  menu.style.top = `${iconRect.bottom + window.scrollY}px`;
  menu.style.left = `${iconRect.left + window.scrollX}px`;
}

function toggleMenu() {
  menu.classList.toggle("show");

  if (menu.classList.contains("show")) {
    positionMenu();
  }
}

window.addEventListener("resize", () => {
  if (menu.classList.contains("show")) {
    positionMenu();
  }
});

window.onclick = function (event) {
  if (
    !menu.contains(event.target) &&
    event.target !== menuIcon &&
    !menuIcon.contains(event.target)
  ) {
    menu.classList.remove("show");
  }
};

window.onload = () => {
  categories = JSON.parse(localStorage.getItem("categories")) || [];
  todos = JSON.parse(localStorage.getItem("todos")) || {};
  updateCalendar();
  loadCategories();
  renderCategoriesForDay();
};
