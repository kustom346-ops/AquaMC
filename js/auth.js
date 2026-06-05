const AUTH_KEY = 'aquamc_user';
const USERS_KEY = 'aquamc_users';
const LAST_ID_KEY = 'aquamc_last_id';

const ROLES = {
  OWNER: { name: 'OWNER', level: 8, canAll: true },
  SO_OWNER: { name: 'SO.OWNER', level: 6, canAll: true },
  TEX_ADMIN: { name: 'TEX.ADMIN', level: 5, canAll: true },
  GL_ADMIN: { name: 'GL.ADMIN', level: 4, canAll: true },
  CURATOR: { name: 'CURATOR', level: 3, canAll: true },
  ADMIN: { name: 'ADMIN', level: 2, canAll: false },
  MODER: { name: 'MODER', level: 1, canAll: false },
  HELPER: { name: 'HELPER', level: 0, canAll: false }
};

function getNextId() {
  let lastId = parseInt(localStorage.getItem(LAST_ID_KEY) || '0');
  lastId++;
  localStorage.setItem(LAST_ID_KEY, lastId.toString());
  return lastId;
}

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

function getUserRank(user) {
  if (!user || !user.rank) return ROLES.HELPER;
  return ROLES[user.rank] || ROLES.HELPER;
}

function canManageAll() {
  const user = getCurrentUser();
  if (!user) return false;
  const rank = getUserRank(user);
  return rank.canAll;
}

function canManageTopics() {
  const user = getCurrentUser();
  if (!user) return false;
  const rank = getUserRank(user);
  return rank.canAll || rank.name === 'ADMIN';
}

function canBan() {
  const user = getCurrentUser();
  if (!user) return false;
  const rank = getUserRank(user);
  return rank.canAll || rank.name === 'ADMIN' || rank.name === 'MODER';
}

function canAccessAdminPanel() {
  const user = getCurrentUser();
  if (!user) return false;
  const rank = getUserRank(user);
  return rank.level >= 1;
}

function isAdmin() {
  return canManageTopics();
}

function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

function registerUser(username, password) {
  const users = getUsers();
  const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    showToast('Пользователь уже существует');
    return false;
  }
  const rank = users.length === 0 ? 'OWNER' : 'HELPER';
  const newUser = { 
    id: getNextId(),
    username, 
    password, 
    rank,
    banned: false,
    registeredAt: new Date().toISOString()
  };
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
  if (user.banned) {
    showToast('Вы забанены');
    return false;
  }
  saveUser({
    id: user.id,
    username: user.username,
    password: user.password,
    rank: user.rank,
    banned: user.banned,
    registeredAt: user.registeredAt
  });
  return true;
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const user = getCurrentUser();
  
  if (!user) {
    navbar.innerHTML = `
      <a href="index.html" class="nav-logo">AQUAMC</a>
      <div class="nav-links">
        <a href="login.html">ВОЙТИ</a>
        <a href="register.html">РЕГИСТРАЦИЯ</a>
      </div>
    `;
    return;
  }

  const rankName = user.rank || 'HELPER';
  const rankLevel = (ROLES[rankName] || ROLES.HELPER).level;
  const showAdminBtn = rankLevel >= 1;

  navbar.innerHTML = `
    <a href="index.html" class="nav-logo">AQUAMC</a>
    <div class="nav-links">
      <span class="user-badge">
        <span class="avatar-circle">${user.username.charAt(0).toUpperCase()}</span>
        <span>${user.username}</span>
        <span style="color:#fbbf24; font-size:0.7rem; margin-left:0.3rem; font-weight:700;">${rankName}</span>
        <span style="color:#6d579b; font-size:0.65rem; margin-left:0.3rem;">#${user.id}</span>
      </span>
      ${showAdminBtn ? '<a href="admin.html" style="color:#fbbf24; font-weight:700; text-decoration:none; padding:0.5rem 1rem; border:2px solid #fbbf24; margin-left:0.5rem;">АДМИН-ПАНЕЛЬ</a>' : ''}
      <button onclick="logoutUser()">ВЫХОД</button>
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