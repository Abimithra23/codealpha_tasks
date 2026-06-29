const songs = [
  { id: 1, title: "Neon Lights", artist: "Aurora Wave", genre: "Electronic", price: 1.29, emoji: "🎵" },
  { id: 2, title: "Midnight Drive", artist: "The Velvet Keys", genre: "Indie", price: 0.99, emoji: "🎸" },
  { id: 3, title: "Solar Bloom", artist: "Prism Echo", genre: "Pop", price: 1.49, emoji: "🎤" },
  { id: 4, title: "Deep Blue", artist: "Ocean Pulse", genre: "Ambient", price: 0.99, emoji: "🎹" },
  { id: 5, title: "Fire & Rain", artist: "Ember Skies", genre: "Rock", price: 1.29, emoji: "🥁" },
  { id: 6, title: "Golden Hour", artist: "Sunset Trio", genre: "Jazz", price: 1.99, emoji: "🎺" },
  { id: 7, title: "Pixel Dreams", artist: "Synthwave X", genre: "Electronic", price: 1.29, emoji: "🎧" },
  { id: 8, title: "Wildflower", artist: "Meadow Folk", genre: "Folk", price: 0.99, emoji: "🪗" },
];

// Store liked/fav in localStorage
function getLiked() { return JSON.parse(localStorage.getItem('liked') || '[]'); }
function getFav() { return JSON.parse(localStorage.getItem('fav') || '[]'); }
function getRecent() { return JSON.parse(localStorage.getItem('recent') || '[]'); }
function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }

function toggleLiked(id) {
  let liked = getLiked();
  liked = liked.includes(id) ? liked.filter(x => x !== id) : [...liked, id];
  localStorage.setItem('liked', JSON.stringify(liked));
}

function toggleFav(id) {
  let fav = getFav();
  fav = fav.includes(id) ? fav.filter(x => x !== id) : [...fav, id];
  localStorage.setItem('fav', JSON.stringify(fav));
}

function addRecent(id) {
  let recent = getRecent().filter(x => x !== id);
  recent = [id, ...recent].slice(0, 10);
  localStorage.setItem('recent', JSON.stringify(recent));
}

function getSongById(id) { return songs.find(s => s.id === id); }

// Render song cards for index page
function renderSongGrid(containerId, songList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const liked = getLiked();
  const fav = getFav();
  container.innerHTML = songList.map(song => `
    <div class="song-card" onclick="playSong(${song.id})">
      <div class="cover">${song.emoji}</div>
      <div class="card-body">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist} &bull; ${song.genre}</div>
        <div class="card-footer">
          <span class="price">$${song.price.toFixed(2)}</span>
          <div class="actions">
            <button class="icon-btn ${liked.includes(song.id) ? 'active' : ''}" onclick="event.stopPropagation(); handleLike(${song.id}, this)" title="Like">♥</button>
            <button class="icon-btn ${fav.includes(song.id) ? 'active' : ''}" onclick="event.stopPropagation(); handleFav(${song.id}, this)" title="Favourite">★</button>
            <button class="buy-btn" onclick="event.stopPropagation(); buyNow(${song.id})">Buy</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function handleLike(id, btn) {
  toggleLiked(id);
  btn.classList.toggle('active');
}

function handleFav(id, btn) {
  toggleFav(id);
  btn.classList.toggle('active');
}

function playSong(id) {
  const song = getSongById(id);
  if (!song) return;
  addRecent(id);
  const player = document.getElementById('mini-player');
  if (player) {
    document.getElementById('player-title').textContent = song.title;
    document.getElementById('player-artist').textContent = song.artist;
    document.getElementById('player-emoji').textContent = song.emoji;
    player.style.display = 'flex';
  }
}

function buyNow(id) {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html?redirect=buy&song=' + id;
    return;
  }
  window.location.href = 'payment.html?song=' + id;
}

// Render song list for profile page
function renderSongList(containerId, ids) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!ids.length) {
    container.innerHTML = '<p style="color:var(--muted);padding:1rem 0;">Nothing here yet.</p>';
    return;
  }
  container.innerHTML = ids.map(id => {
    const song = getSongById(id);
    if (!song) return '';
    return `
      <div class="song-list-item" onclick="playSong(${song.id})">
        <div class="item-icon">${song.emoji}</div>
        <div class="item-info">
          <div class="item-title">${song.title}</div>
          <div class="item-artist">${song.artist}</div>
        </div>
        <span class="item-price">$${song.price.toFixed(2)}</span>
        <button class="buy-btn" onclick="event.stopPropagation(); buyNow(${song.id})">Buy</button>
      </div>
    `;
  }).join('');
}

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
}

// Login
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = email.split('@')[0];
  localStorage.setItem('user', JSON.stringify({ name, email }));
  const params = new URLSearchParams(window.location.search);
  if (params.get('redirect') === 'buy' && params.get('song')) {
    window.location.href = 'payment.html?song=' + params.get('song');
  } else {
    window.location.href = 'profile.html';
  }
}

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Payment
function initPayment() {
  const params = new URLSearchParams(window.location.search);
  const songId = parseInt(params.get('song'));
  const song = getSongById(songId);
  if (!song) return;

  document.getElementById('order-emoji').textContent = song.emoji;
  document.getElementById('order-title').textContent = song.title;
  document.getElementById('order-artist').textContent = song.artist;
  document.getElementById('order-price').textContent = '$' + song.price.toFixed(2);
  document.getElementById('total-amount').textContent = '$' + song.price.toFixed(2);

  document.querySelectorAll('.pay-method').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

function handlePayment(e) {
  e.preventDefault();
  document.getElementById('success-overlay').classList.add('show');
}

function goHome() {
  window.location.href = 'index.html';
}
