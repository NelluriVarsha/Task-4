// ===== Dark Mode Toggle =====
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function setTheme(theme) {
  if (theme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = '☀️ Light Mode';
  } else {
    htmlElement.removeAttribute('data-theme');
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }
  localStorage.setItem('theme', theme);
}

// Load saved theme or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  setTheme('light'); // Always default to light mode
}


themeToggleBtn.addEventListener('click', () => {
  const isDark = htmlElement.getAttribute('data-theme') === 'dark';
  setTheme(isDark ? 'light' : 'dark');
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  contactStatus.textContent = '';
  const name = contactForm.querySelector('input[type="text"]').value.trim();
  const email = contactForm.querySelector('input[type="email"]').value.trim();
  const message = contactForm.querySelector('textarea').value.trim();

  if (!name || !email || !message) {
    contactStatus.textContent = 'Please fill all fields.';
    contactStatus.style.color = '#c0392b';
    return;
  }

  // Fake sending delay
  contactStatus.textContent = 'Sending...';
  contactStatus.style.color = varColor('--primary');
  setTimeout(() => {
    contactStatus.textContent = 'Message sent! Thank you.';
    contactStatus.style.color = varColor('--green');
    contactForm.reset();
  }, 1500);
});

// Helper to get CSS variable color value
function varColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name) || '#000';
}

// ===== To-Do List =====
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoListEl = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.btn-todo-filter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoListEl.innerHTML = '';
  let filteredTodos = todos;
  if (currentFilter === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }

  if (filteredTodos.length === 0) {
    todoListEl.innerHTML = `<li aria-live="polite">No tasks here.</li>`;
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.setAttribute('tabindex', 0);
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span class="todo-task-text">${escapeHtml(todo.text)}</span>
      <button class="todo-remove-btn" aria-label="Remove task">&times;</button>
    `;

    // Toggle complete on text click
    li.querySelector('.todo-task-text').addEventListener('click', () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    // Remove task
    li.querySelector('.todo-remove-btn').addEventListener('click', () => {
      todos = todos.filter(t => t !== todo);
      saveTodos();
      renderTodos();
    });

    todoListEl.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    todoInput.value = '';
    saveTodos();
    renderTodos();
  }
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
});

// Filter buttons event
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');

    // Update aria-pressed
    filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', 'true');

    renderTodos();
  });
});

// Sanitize text for safety
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

renderTodos();

// ===== Product Listing =====
const products = [
  { name: 'Smartphone', category: 'tech', price: 799 },
  { name: 'Laptop', category: 'tech', price: 1299 },
  { name: 'T-shirt', category: 'fashion', price: 25 },
  { name: 'Sneakers', category: 'fashion', price: 60 },
  { name: 'Smartwatch', category: 'tech', price: 199 },
  { name: 'Jeans', category: 'fashion', price: 50 },
];

const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const productGrid = document.getElementById('product-grid');

function renderProducts() {
  let filtered = [...products];
  const category = categoryFilter.value;
  const sort = sortBy.value;

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (sort === 'priceLow') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'priceHigh') {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = '';
  if (filtered.length === 0) {
    productGrid.innerHTML = '<p>No products found.</p>';
    return;
  }

  filtered.forEach(p => {
    const div = document.createElement('div');
    div.setAttribute('tabindex', 0);
    div.innerHTML = `
      <strong>${escapeHtml(p.name)}</strong>
      <span>$${p.price.toFixed(2)}</span>
      <em>${escapeHtml(p.category)}</em>
    `;
    productGrid.appendChild(div);
  });
}

categoryFilter.addEventListener('change', renderProducts);
sortBy.addEventListener('change', renderProducts);

renderProducts();
// ===== Dynamic Background Color Changer (Mild Dark Body, Light Section) =====

const mildDarkColors = [
  '#dce3ea', // very light slate
  '#cdd8e0', // light blue-gray
  '#d6d6d6', // soft gray
  '#e0e0e0', // warm light gray
  '#d2dbdd', // muted sky
  '#cfd8dc'  // light steel
];

const softLightSectionColors = [
  '#ffffff', // pure white
  '#f9f9fb', // very pale lavender
  '#fef7f1', // warm off-white
  '#f0f8ff', // alice blue
  '#fdfde7', // lemon white
  '#f1f8e9'  // mint white
];

let colorIndex = 0;

setInterval(() => {
  const bodyBg = mildDarkColors[colorIndex % mildDarkColors.length];
  const sectionBg = softLightSectionColors[colorIndex % softLightSectionColors.length];

  document.body.style.backgroundColor = bodyBg;

  document.querySelectorAll('.section').forEach(section => {
    section.style.backgroundColor = sectionBg;
  });

  colorIndex++;
}, 3000);
