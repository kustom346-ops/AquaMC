const AUTH_KEY = 'aquamc_user';
const USERS_KEY = 'aquamc_users';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
  }
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

function registerUser(username, password) {
  const users = getUsers();
  const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    showToast('Пользователь уже существует');
    return false;
  }
  const role = users.length === 0 ? 'admin' : 'user';
  const newUser = { username, password, role };
  users.push(newUser);
  saveUsers(users);
  saveUser(newUser);
  return true;
}

function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    showToast('Неверное имя пользователя или пароль');
    return false;
  }
  saveUser(user);
  return true;
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const user = getCurrentUser();
  navbar.innerHTML = `
    <a href="index.html" class="nav-logo">AQUAMC</a>
    <div class="nav-links">
      ${user ? `
        <span class="user-badge">
          <span class="avatar-circle">${user.username.charAt(0).toUpperCase()}</span>
          <span>${user.username}</span>
          ${user.role === 'admin' ? '<span style="color:#c084fc;font-size:0.7rem;">ADMIN</span>' : ''}
        </span>
        <button onclick="logoutUser()">ВЫХОД</button>
      ` : `
        <a href="login.html">ВОЙТИ</a>
        <a href="register.html">РЕГИСТРАЦИЯ</a>
      `}
    </div>
  `;
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', initNavbar);