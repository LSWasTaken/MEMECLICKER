import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  setDoc
} from 'firebase/firestore';

const ranks = [
  '🍼 Baby Clicker',
  '🧠 Reddit Scholar',
  '👑 Meme Knight',
  '💀 Giga Clicker',
  '🪑 Chair Whisperer',
  '🌌 Lord of the Memes',
  '🧙‍♂️ Dank Wizard',
  '🌍 World Click Champion',
  '👾 Reality Bender',
  '💫 Click God',
];

const emojiList = ['🔥', '💯', '😂', '🥵', '🐸', '🧠', '💀', '🪑', '🍕', '🧃'];

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('meme-clicker-count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [emojis, setEmojis] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const currentRank = Math.floor(count / 1000);
  const rankName = ranks[currentRank] || '👽 Interdimensional Clicker';
  const progress = ((count % 1000) / 1000) * 100;

  const handleClick = () => setCount((c) => c + 1);

  const handleEmojiClick = (id) => {
    setCount((c) => c + 1000);
    setEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  // Save count to localStorage and Firebase
  useEffect(() => {
    localStorage.setItem('meme-clicker-count', count.toString());

    if (username && count > 0) {
      const updateScore = async () => {
        await setDoc(doc(db, 'scores', username), {
          name: username,
          score: count,
        });
      };
      updateScore();
    }
  }, [count, username]);

  // Get leaderboard from Firebase
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(5));
      const snapshot = await getDocs(q);
      setLeaderboard(snapshot.docs.map(doc => doc.data()));
    };
    fetchLeaderboard();
  }, [count]);

  // Emoji spawner
  useEffect(() => {
    const spawnEmoji = () => {
      const id = Date.now();
      const newEmoji = {
        id,
        emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
        left: Math.random() * 90,
        top: Math.random() * 80,
      };
      setEmojis((prev) => [...prev, newEmoji]);
      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 3000);
    };
    const spawnInterval = setInterval(spawnEmoji, 1500);
    return () => clearInterval(spawnInterval);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setEmojis((prev) =>
        prev.map((e) => ({
          ...e,
          left: Math.random() * 90,
          top: Math.random() * 80,
        }))
      );
    }, 250);
    return () => clearInterval(moveInterval);
  }, []);

  const resetScore = () => {
    setCount(0);
    localStorage.removeItem('meme-clicker-count');
  };

  const handleUsernameSubmit = () => {
    localStorage.setItem('username', username);
  };

  return (
    <div className="meme-zone">
      <h1>💥 Meme Clicker 3000: CHAOS ULTRA EDITION 💥</h1>
      {!username ? (
        <div className="username-input">
          <input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleUsernameSubmit}>Start</button>
        </div>
      ) : (
        <>
          <h2>{rankName}</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <button onClick={handleClick} className="meme-button">
            🚀 Click Count: {count}
          </button>
          <button onClick={resetScore} className="meme-button danger">
            🧹 Reset My Shame
          </button>
          <p className="desc">🎯 Try tapping the teleporting emojis... if you can.</p>
          {emojis.map((e) => (
            <span
              key={e.id}
              className="floating-emoji"
              style={{ left: `${e.left}%`, top: `${e.top}%` }}
              onClick={() => handleEmojiClick(e.id)}
            >
              {e.emoji}
            </span>
          ))}

          <h3>🌐 Top Meme Lords:</h3>
          <ul className="leaderboard">
            {leaderboard.map((entry, idx) => (
              <li key={idx}>{entry.name}: {entry.score}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
