const API = 'http://localhost:3000/api';

// ── AUTH HELPERS ─────────────────────────────────────────────────
function getToken() { return localStorage.getItem('token'); }
function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }
function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
function logout() { clearAuth(); window.location.href = 'index.html'; }

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── TOAST ────────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── PLAYER ───────────────────────────────────────────────────────
let currentAudio = null;
let isPlaying = false;

async function playSong(song) {
  const user = getUser();
  if (!user) { window.location.href = 'login.html'; return; }

  try {
    const { audioUrl } = await apiFetch(`/songs/${song.id}/stream`);

    if (currentAudio) { currentAudio.pause(); currentAudio = null; }

    currentAudio = new Audio(audioUrl);
    currentAudio.play();
    isPlaying = true;

    // Track recent
    apiFetch(`/profile/recent/${song.id}`, { method: 'POST' }).catch(() => {});

    // Update mini player
    const player = document.getElementById('mini-player');
    document.getElementById('player-emoji').textContent = song.emoji;
    document.getElementById('player-title').textContent = song.title;
    document.getElementById('player-artist').textContent = song.artist;
    document.getElementById('play-pause-btn').textContent = '⏸';
    player.classList.add('visible');

    currentAudio.addEventListener('timeupdate', () => {
      if (!currentAudio.duration) return;
      const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
      const fill = document.getElementById('progress-fill');
      const cur = document.getElementById('current-time');
      const dur = document.getElementById('duration');
      if (fill) fill.style.width = pct + '%';
      if (cur) cur.textContent = formatTime(currentAudio.currentTime);
      if (dur) dur.textContent = formatTime(currentAudio.duration);
    });

    currentAudio.addEventListener('ended', () => {
      isPlaying = false;
      document.getElementById('play-pause-btn').textContent = '▶';
    });

  } catch (e) {
    showToast('Could not load audio. Please try again.');
  }
}

function togglePlayPause() {
  if (!currentAudio) return;
  if (isPlaying) { currentAudio.pause(); isPlaying = false; document.getElementById('play-pause-btn').textContent = '▶'; }
  else { currentAudio.play(); isPlaying = true; document.getElementById('play-pause-btn').textContent = '⏸'; }
}

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// ── SONG CARDS ───────────────────────────────────────────────────
function renderSongGrid(containerId, songList, liked = [], fav = []) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = songList.map(song => `
    <div class="song-card">
      <div class="cover">${song.emoji}</div>
      <div class="card-body">
        <div class="song-title">${song.title}</div>
        <div class="song-meta">${song.artist} &bull; ${song.genre} &bull; ${song.duration}</div>
        <div class="card-footer">
          <span class="price">$${song.price.toFixed(2)}</span>
          <div class="actions">
            <button class="icon-btn ${liked.includes(song.id) ? 'active' : ''}" onclick="handleLike(${song.id}, this)" title="Like">♥</button>
            <button class="icon-btn ${fav.includes(song.id) ? 'active' : ''}" onclick="handleFav(${song.id}, this)" title="Favourite">★</button>
            <button class="play-btn" onclick="playSong(${JSON.stringify(song).replace(/"/g, '&quot;')})" title="Preview">▶</button>
            <button class="buy-btn" onclick="buyNow(${song.id})">Buy</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

async function handleLike(id, btn) {
  if (!getUser()) { window.location.href = 'login.html'; return; }
  try {
    await apiFetch(`/profile/like/${id}`, { method: 'POST' });
    btn.classList.toggle('active');
    showToast(btn.classList.contains('active') ? '♥ Added to Liked' : 'Removed from Liked');
  } catch { showToast('Please log in first'); }
}

async function handleFav(id, btn) {
  if (!getUser()) { window.location.href = 'login.html'; return; }
  try {
    await apiFetch(`/profile/fav/${id}`, { method: 'POST' });
    btn.classList.toggle('active');
    showToast(btn.classList.contains('active') ? '★ Added to Favourites' : 'Removed from Favourites');
  } catch { showToast('Please log in first'); }
}

function buyNow(id) {
  if (!getUser()) { window.location.href = 'login.html?redirect=buy&song=' + id; return; }
  window.location.href = 'payment.html?song=' + id;
}

// ── SONG LIST (profile) ──────────────────────────────────────────
function renderSongList(containerId, ids, allSongs) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = ids.map(id => allSongs.find(s => s.id === id)).filter(Boolean);
  if (!list.length) { container.innerHTML = '<p class="empty-msg">Nothing here yet.</p>'; return; }
  container.innerHTML = list.map(song => `
    <div class="song-list-item">
      <div class="item-icon">${song.emoji}</div>
      <div class="item-info">
        <div class="item-title">${song.title}</div>
        <div class="item-artist">${song.artist} &bull; ${song.genre}</div>
      </div>
      <span class="item-price">$${song.price.toFixed(2)}</span>
      <button class="play-btn" onclick="playSong(${JSON.stringify(song).replace(/"/g, '&quot;')})" title="Play">▶</button>
      <button class="buy-btn" onclick="buyNow(${song.id})">Buy</button>
    </div>
  `).join('');
}

// ── TABS ─────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${name}"]`).classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ── NAV STATE ────────────────────────────────────────────────────
function updateNav() {
  const user = getUser();
  const loginLink = document.getElementById('nav-login');
  const profileLink = document.getElementById('nav-profile');
  const logoutLink = document.getElementById('nav-logout');
  if (loginLink) loginLink.style.display = user ? 'none' : 'inline';
  if (profileLink) profileLink.style.display = user ? 'inline' : 'none';
  if (logoutLink) logoutLink.style.display = user ? 'inline' : 'none';
}
