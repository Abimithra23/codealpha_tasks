// All audio from Internet Archive — public domain / Musopen CC0 recordings
// Direct stream URL: https://archive.org/download/{identifier}/{filename}
const songs = [
  {
    id: 1,
    title: "Ballade No. 1 Op. 23",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.29,
    emoji: "🎹",
    duration: "8:42",
    audioUrl: "https://archive.org/download/musopen-chopin/Ballade%20no.%201%20-%20Op.%2023.mp3",
    description: "One of Chopin's most dramatic and passionate ballades."
  },
  {
    id: 2,
    title: "Fantasie Impromptu Op. 66",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 0.99,
    emoji: "🌙",
    duration: "5:10",
    audioUrl: "https://archive.org/download/musopen-chopin/Fantasie%20Impromptu%20Op.%2066.mp3",
    description: "Chopin's brilliant and fast-paced posthumous masterpiece."
  },
  {
    id: 3,
    title: "Ballade No. 2 Op. 38",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.49,
    emoji: "🎼",
    duration: "7:05",
    audioUrl: "https://archive.org/download/musopen-chopin/Ballade%20no.%202%20-%20Op.%2038.mp3",
    description: "A lyrical and stormy second ballade by Chopin."
  },
  {
    id: 4,
    title: "Impromptu No. 1 Op. 29",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 0.99,
    emoji: "🕯️",
    duration: "4:28",
    audioUrl: "https://archive.org/download/musopen-chopin/Impromptu%20no.%201%20-%20Op.%2029.mp3",
    description: "A flowing and elegant impromptu full of grace."
  },
  {
    id: 5,
    title: "Ballade No. 3 Op. 47",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.29,
    emoji: "🌸",
    duration: "7:30",
    audioUrl: "https://archive.org/download/musopen-chopin/Ballade%20no.%203%20-%20Op.%2047.mp3",
    description: "Chopin's playful yet deeply emotional third ballade."
  },
  {
    id: 6,
    title: "Impromptu No. 2 Op. 36",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.49,
    emoji: "🎵",
    duration: "6:50",
    audioUrl: "https://archive.org/download/musopen-chopin/Impromptu%20no.%202%20-%20Op.%2036.mp3",
    description: "A rich and expressive second impromptu."
  },
  {
    id: 7,
    title: "Ballade No. 4 Op. 52",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.99,
    emoji: "⚡",
    duration: "11:20",
    audioUrl: "https://archive.org/download/musopen-chopin/Ballade%20no.%204%20-%20Op.%2052.mp3",
    description: "Chopin's final and most complex ballade — a true epic."
  },
  {
    id: 8,
    title: "Mazurka Op. 17 No. 4 in A minor",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 0.99,
    emoji: "🌹",
    duration: "5:15",
    audioUrl: "https://archive.org/download/musopen-chopin/Mazurka%2C%20Op.%2017%20no.%204%20in%20A%20minor",
    description: "A melancholic and introspective mazurka."
  },
  {
    id: 9,
    title: "Impromptu No. 3 Op. 51",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.29,
    emoji: "🎻",
    duration: "6:20",
    audioUrl: "https://archive.org/download/musopen-chopin/Impromptu%20no.%203%20-%20Op.%2051.mp3",
    description: "Chopin's third impromptu — lyrical and deeply felt."
  },
  {
    id: 10,
    title: "Grande Valse Brillante Op. 18",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 1.49,
    emoji: "💃",
    duration: "5:45",
    audioUrl: "https://archive.org/download/musopen-chopin/Grande%20Valse%20Brilliante%2C%20Op.%2018%20in%20E%20Flat%20Major",
    description: "A sparkling and energetic waltz full of brilliance."
  },
  {
    id: 11,
    title: "Fugue in A minor B. 144",
    artist: "Frédéric Chopin",
    genre: "Baroque",
    price: 0.99,
    emoji: "🎼",
    duration: "2:30",
    audioUrl: "https://archive.org/download/musopen-chopin/Fugue%20in%20A%20minor%20B.%20144.mp3",
    description: "A rare and intricate fugue from Chopin's early works."
  },
  {
    id: 12,
    title: "Canon in F minor",
    artist: "Frédéric Chopin",
    genre: "Classical",
    price: 0.99,
    emoji: "🕊️",
    duration: "1:55",
    audioUrl: "https://archive.org/download/musopen-chopin/Canon%20in%20F%20minor.mp3",
    description: "A short and beautiful canon — rarely heard gem."
  }
];

module.exports = songs;
