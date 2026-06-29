const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const songs = require('./data/songs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'vibestore_secret_2026';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory user store (no DB needed for demo)
const users = [];

// ── AUTH MIDDLEWARE ──────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── AUTH ROUTES ──────────────────────────────────────────────────
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hashed, liked: [], fav: [], recent: [], purchased: [] };
  users.push(user);
  const token = jwt.sign({ id: user.id, name, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name, email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, name: user.name, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email } });
});

// ── SONG ROUTES ──────────────────────────────────────────────────
app.get('/api/songs', (req, res) => {
  res.json(songs.map(({ audioUrl, ...s }) => s)); // hide audio URL for non-auth
});

app.get('/api/songs/:id/stream', authMiddleware, (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ error: 'Song not found' });
  res.json({ audioUrl: song.audioUrl });
});

// ── USER PROFILE ROUTES ──────────────────────────────────────────
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ name: user.name, email: user.email, liked: user.liked, fav: user.fav, recent: user.recent, purchased: user.purchased });
});

app.post('/api/profile/like/:id', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const id = parseInt(req.params.id);
  user.liked = user.liked.includes(id) ? user.liked.filter(x => x !== id) : [...user.liked, id];
  res.json({ liked: user.liked });
});

app.post('/api/profile/fav/:id', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const id = parseInt(req.params.id);
  user.fav = user.fav.includes(id) ? user.fav.filter(x => x !== id) : [...user.fav, id];
  res.json({ fav: user.fav });
});

app.post('/api/profile/recent/:id', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const id = parseInt(req.params.id);
  user.recent = [id, ...user.recent.filter(x => x !== id)].slice(0, 10);
  res.json({ recent: user.recent });
});

// ── PAYMENT ROUTE ────────────────────────────────────────────────
app.post('/api/purchase', authMiddleware, (req, res) => {
  const { songId, paymentMethod } = req.body;
  const user = users.find(u => u.id === req.user.id);
  const song = songs.find(s => s.id === parseInt(songId));
  if (!song) return res.status(404).json({ error: 'Song not found' });

  if (!user.purchased.includes(song.id)) user.purchased.push(song.id);

  // Simulate payment success
  res.json({
    success: true,
    message: `Purchase successful! "${song.title}" is now in your library.`,
    song: { id: song.id, title: song.title, artist: song.artist }
  });
});

// ── SERVE CLIENT ─────────────────────────────────────────────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎵 VibeStore running at http://localhost:${PORT}\n`);
});
